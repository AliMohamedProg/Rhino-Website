using Apis.Models;
using Bl.Contracts;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;
using Bl.DTOs;
using Domains;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrder _orderService;
        private readonly IUserService _userService;
        private readonly IPaymobPayment _paymobService;

        public OrderController(IOrder orderService, IUserService userService, IPaymobPayment paymobService)
        {
            _orderService = orderService;
            _userService = userService;
            _paymobService = paymobService;
        }

        [HttpPost("create-from-cart")]
        public async Task<ApiResponse<TbOrder>> CreateOrderFromCart(OrderRequest orderRequest)
        {
            try
            {
                var userId = _userService.GetLoggedInUser();
                var order = await _orderService.CreateOrder(userId,orderRequest);
                
                return new ApiResponse<TbOrder>()
                {
                    Success = true,
                    Message = "order found successfully.",
                    Data =  order,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<TbOrder>()
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null,
                    StatusCode = 500
                };
            }
        }

        [HttpGet("{id}")]
        public async Task<ApiResponse<OrderDto>> GetOrder(Guid id)
        {
            try
            {
                var order = await _orderService.GetOrderById(id);
                return new ApiResponse<OrderDto>()
                {
                    Success = true,
                    Message = "order found successfully.",
                    Data =  order,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<OrderDto>()
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null,
                    StatusCode = 500
                };
            }
        }

        [HttpGet("my-orders")]
        public async Task<ApiResponse<List<OrderDto>>> GetUserOrders()
        {
            try
            {
                var userId = _userService.GetLoggedInUser();
                var orders = await _orderService.GetUserOrders(userId);
                return new ApiResponse<List<OrderDto>>()
                {
                    Success = true,
                    Message = "Item found successfully.",
                    Data =  orders,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<OrderDto>>()
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null,
                    StatusCode = 500
                };
            }
        }
        
        [HttpPost("mark-as-paid/{orderId}")]
        public async Task<ApiResponse<bool>> MarkAsPaid(Guid orderId, [FromQuery] string transactionId)
        {
            try
            {
                await _orderService.MarkOrderAsPaid(orderId, transactionId);
                return new ApiResponse<bool>()
                {
                    Success = true,
                    Message = "order marks as paid successfully.",
                    Data = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<bool>()
                {
                    Success = false,
                    Message = ex.Message,
                    Data = false,
                    StatusCode = 500
                };
            }
        }

        [HttpPost("cancel-order/{orderId}")]
        public async Task<ApiResponse<bool>> CancelOrder(Guid orderId)
        {
                try
                {
                    var order = await _orderService.GetOrderById(orderId);
                    if (order == null) return new ApiResponse<bool>()
                    {
                        Success = false,
                        Message = "order is not found.",
                        Data = false,
                        StatusCode = 404
                    };

                    if (order.Status == "Shipped" || order.Status == "Delivered")
                    {
                        return new ApiResponse<bool>()
                        {
                            Success = false,
                            Message = "The order can't be canceled because it is shipped or delivered.",
                            Data = false,
                            StatusCode = 500,
                        };
                    }

                    // Handling Refund if Paid and it's not COD (or if it's already Paid)
                    if (order.PaymentStatus == "Paid" && !string.IsNullOrEmpty(order.PaymobTransactionId))
                    {
                        bool refundSuccess = await _paymobService.Refund(order.PaymobTransactionId, order.Total);
                        if (!refundSuccess)
                        {
                            // Maybe log this or throw exception if you want to prevent cancellation if refund fails
                            // throw new Exception("Refund failed. Could not cancel order.");
                        }
                        else
                        {
                            await _orderService.UpdateOrderPaymentStatus(orderId, order.PaymobTransactionId, "Refunded");
                        }
                    }

                    if (order.Status == "Pending" || order.Status == "Processing")
                    {
                        await _orderService.UpdateOrderStatus(orderId, "Cancelled");
                        return new ApiResponse<bool>()
                        {
                            Success = true,
                            Message = "Order Cancelled successfully.",
                            Data = true,
                            StatusCode = 200,
                        };
                    }
                    return new ApiResponse<bool>()
                    {
                        Success = true,
                        Message = "Order Cancelled successfully.",
                        Data = true,
                        StatusCode = 200,
                    };
                }
                catch (Exception ex)
                {
                    return new ApiResponse<bool>()
                    {
                        Success = false,
                        Message = ex.Message,
                        Data = false,
                        StatusCode = 500
                    };
                }
                
        }
    }
}
