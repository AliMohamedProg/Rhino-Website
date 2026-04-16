using System;
using System.Collections.Generic;
using System.Text;
using System.Globalization;
using Bl.Contracts;
using Bl.DTOs;
using DAL.Contracts;
using DAL.Repositories;
using DAL.UserModel;
using Domains;
using Microsoft.EntityFrameworkCore;

namespace Bl.Services
{


    public class DashboardService : IDashboardService
    {
        private readonly ITableRepository<TbOrder> _orderRepo;
        private readonly ITableRepository<TbItem> _productRepo;
        private readonly ITableRepository<TbOrderItem> _orderItemRepo;

        public DashboardService(
            ITableRepository<TbOrder> orderRepo,
            ITableRepository<TbItem> productRepo,
            ITableRepository<TbOrderItem> orderItemRepo)
        {
            _orderRepo = orderRepo;
            _productRepo = productRepo;
            _orderItemRepo = orderItemRepo;
        }

        public async Task<DashboardDto> GetDashboardAsync()
        {
            var totalOrders = await _orderRepo.CountAsync(o => o.CurrentState == 1);
            var totalProducts = await _productRepo.CountAsync(p => p.CurrentState == 1);
            var totalUsers = await _orderRepo.GetUserCount();

            // 🔥 Orders Query (بـ IQueryable بدون ToList)
            var ordersQuery = _orderRepo
                .Query()
                .Where(o => o.Status == "Delivered");

            // 🔥 OrderItems Query (IQueryable مش List)
            var orderItemsQuery = _orderItemRepo
                .Query()
                .Include(oi => oi.Item)
                .ThenInclude(i => i.Category);

            var dashboard = new DashboardDto
            {
                TotalOrders = totalOrders,
                TotalProducts = totalProducts,
                TotalUsers = totalUsers,

                TotalRevenue = await ordersQuery.SumAsync(o => o.Total),

                MonthlySales = await ordersQuery
                    .GroupBy(o => o.CreatedDate.Value.Month)
                    .Select(g => new MonthlySalesDto
                    {
                        Month = g.Key,
                        MonthName = CultureInfo.CurrentCulture
                            .DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                        Total = g.Sum(x => x.Total)
                    })
                    .OrderBy(x => x.Month)
                    .ToListAsync(),

                MonthlyOrders = await ordersQuery
                    .GroupBy(o => o.CreatedDate.Value.Month)
                    .Select(g => new MonthlyOrdersDto
                    {
                        Month = g.Key,
                        MonthName = CultureInfo.CurrentCulture
                            .DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                        Count = g.Count()
                    })
                    .OrderBy(x => x.Month)
                    .ToListAsync(),

                TopCategories = await orderItemsQuery
                    .Where(x => x.Item != null && x.Item.Category != null)
                    .GroupBy(oi => new
                    {
                        oi.Item.Category.NameAr,
                        oi.Item.Category.NameEn
                    })
                    .Select(g => new CategorySalesDto
                    {
                        NameAr = g.Key.NameAr,
                        NameEn = g.Key.NameEn,
                        TotalSold = g.Sum(x => x.Qty)
                    })
                    .OrderByDescending(x => x.TotalSold)
                    .Take(5)
                    .ToListAsync(),

                RecentOrders = await ordersQuery
                    .OrderByDescending(o => o.CreatedDate)
                    .Take(5)
                    .Select(o => new RecentOrderDto
                    {
                        OrderNumber = o.OrderNumber,
                        CustomerName = o.FirstName + " " + o.LastName,
                        Total = o.Total,
                        Status = o.Status,
                        Date = o.CreatedDate
                    })
                    .ToListAsync(),

                TopProducts = await orderItemsQuery
                    .Where(x => x.Item != null)
                    .GroupBy(oi => new
                    {
                        oi.Item.NameAr,
                        oi.Item.NameEn,
                        oi.Item.Price,
                        oi.Item.StockNumber
                    })
                    .Select(g => new TopProductDto
                    {
                        NameAr = g.Key.NameAr,
                        NameEn = g.Key.NameEn,
                        Price = g.Key.Price,
                        Stock = g.Key.StockNumber,
                        TotalSold = g.Sum(x => x.Qty)
                    })
                    .OrderByDescending(x => x.TotalSold)
                    .Take(5)
                    .ToListAsync()
            };

            return dashboard;
        }
    }
}