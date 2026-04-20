using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using BusinessLayer.Services;
using DAL.Contracts;
using DAL.Repositories;
using Domains;
using Microsoft.EntityFrameworkCore;

namespace Bl.Services
{
    public class OrderService : BaseService<TbOrder, OrderDto>, IOrder
    {
        ICartRepository _cartRepository;
        ITableRepository<TbOrder> _tableRepository;
        ITableRepository<TbItem> _itemRepository;
        IMapper _mapper;

        public OrderService(ITableRepository<TbOrder> _repository, IMapper _Mapper, IUserService userService, ICartRepository cartRepository, ITableRepository<TbItem> itemRepository)
            : base(_repository, _Mapper, userService)
        {
            _cartRepository = cartRepository;
            _tableRepository = _repository;
            _itemRepository = itemRepository;
            _mapper = _Mapper;
        }
        public async Task<TbOrder> CreateOrder(Guid userId, string Country, string paymentMethodName, string City, string Address, decimal Total, string PhoneNumber, string Email, string FirstName, string LastName, string? transactionId = null)
        {
            var cart = await _cartRepository.GetActiveCartWithItemsAsync(userId);
            if (cart == null || !cart.Items.Any())
                throw new Exception("Cart is empty!");
            var order = new TbOrder
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Total = cart.Items.Sum(i => i.Price * i.StockNumber),
                Country = Country,
                City = City,
                Address = Address,
                PhoneNumber = PhoneNumber,
                Email = Email,
                FirstName = FirstName,
                LastName = LastName,
                Status = "Pending",
                PaymentStatus = transactionId != null ? "Paid" : "Pending",
                PaymobTransactionId = transactionId,
                OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                CurrentState = 1,
                DelivryDate = DateTime.Now.AddDays(5),
                PaymentMethodName = paymentMethodName
            };

            foreach (var item in cart.Items)
            {
                order.TbOrderItems.Add(new TbOrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ItemId = item.ItemId,
                    Qty = item.StockNumber,
                    UnitPrice = item.Price,
                    nameAr = item.NameAr,
                    nameEn = item.NameEn,
                    Image = item.Image,
                    CurrentState = 1
                });

                // Decrease stock
                var dbItem = _itemRepository.GetById(item.ItemId);
                if (dbItem != null)
                {
                    dbItem.StockNumber -= item.StockNumber;
                    _itemRepository.Update(dbItem);
                }
            }

            _tableRepository.Add(order);

            // إفراغ الكارت
            await _cartRepository.DeleteCart(userId);

            return order;
        }

        public async Task<List<OrderDto>> GetUserOrders(Guid userId)
        {
            var orders = await _tableRepository.GetList<TbOrder>(filter: o => o.UserId == userId && o.CurrentState == 1, orderBy: o => o.OrderDate, isDescending: true, includers: o => o.TbOrderItems);

            return _mapper.Map<List<OrderDto>>(orders);
        }


        public async Task<OrderDto> GetOrderById(Guid id)
        {
            var order = await _tableRepository.GetList<TbOrder>(
                filter: o => o.Id == id && o.CurrentState == 1,
                includers: o => o.TbOrderItems
            );

            var entity = order.FirstOrDefault();

            if (entity == null)
                return null;

            return _mapper.Map<OrderDto>(entity);
        }
        public async Task<List<OrderDto>> GetAllOrders()
        {
            var orders = await _tableRepository.GetList<TbOrder>(filter: o => o.CurrentState == 1, orderBy: o => o.OrderDate, isDescending: true, includers: o => o.TbOrderItems);
            return _mapper.Map<List<OrderDto>>(orders);
        }
        public async Task<bool> UpdateOrderStatus(Guid orderId, string status)
        {
            var orders = await _tableRepository.GetList<TbOrder>(
                filter: o => o.Id == orderId,
                includers: o => o.TbOrderItems
            );
            var order = orders.FirstOrDefault();

            if (order == null)
                throw new Exception("Order not found");

            string oldStatus = order.Status;
            order.Status = status;

            // Handle Stock if cancelled
            if (status == "Cancelled" && oldStatus != "Cancelled")
            {
                foreach (var item in order.TbOrderItems)
                {
                    var dbItem = _itemRepository.GetById(item.ItemId);
                    if (dbItem != null)
                    {
                        dbItem.StockNumber += item.Qty;
                        _itemRepository.Update(dbItem);
                    }
                }
            }

            _tableRepository.Update(order);

            return true;
        }

        public async Task<bool> UpdateOrderPaymentStatus(Guid orderId, string transactionId, string status)
        {
            var order = _tableRepository.GetFirstOrDefault(
                filter: o => o.Id == orderId
            );

            if (order == null)
                throw new Exception("Order not found");

            order.PaymentStatus = status;
            order.PaymobTransactionId = transactionId;

            _tableRepository.Update(order);

            return true;
        }
        public async Task MarkOrderAsPaid(Guid orderId, string transactionId)
        {
            var order = _tableRepository.GetById(orderId);

            if (order == null)
                return;
            if (order.Status == "Cancelled")
                return;

            // ✅ لو الأوردر متدفع قبل كده → متعملش حاجة
            if (order.PaymentStatus == "Paid")
                return;

            order.PaymentStatus = "Paid";
            order.PaymobTransactionId = transactionId;
            order.Status = "Processing";

            _tableRepository.Update(order);
        }

    }
}
