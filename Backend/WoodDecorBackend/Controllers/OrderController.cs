using Apis.Models;
using Bl.Contracts;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

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

        // ------------------ إنشاء Order من Cart ------------------
        [HttpPost("create-from-cart")]
        public async Task<IActionResult> CreateOrderFromCart(AddOrderRequest orderRequest)
        {
            try
            {
                // نفترض إن الـ userId موجود من الـ JWT أو session
                var userId = _userService.GetLoggedInUser();

                var order = await _orderService.CreateOrder(userId, orderRequest.Country, orderRequest.PaymentMethodName, orderRequest.City,
                    orderRequest.Address, orderRequest.Total, orderRequest.PhoneNumber, orderRequest.Email, orderRequest.FirstName, orderRequest.LastName,
                    orderRequest.TransactionId);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ------------------ جلب Order واحد ------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            try
            {
                var order = await _orderService.GetOrderById(id);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ------------------ جلب كل Orders لمستخدم ------------------
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetUserOrders()
        {
            try
            {
                var userId = _userService.GetLoggedInUser();
                var orders = await _orderService.GetUserOrders(userId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpPost("mark-as-paid/{orderId}")]
        public async Task<IActionResult> MarkAsPaid(Guid orderId, [FromQuery] string transactionId)
        {
            try
            {
                await _orderService.MarkOrderAsPaid(orderId, transactionId);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("cancel-order/{orderId}")]
        public async Task<bool> CancelOrder(Guid orderId)
        {
            try
            {
                var order = await _orderService.GetOrderById(orderId);
                if (order == null) return false;

                if (order.Status == "Shipped" || order.Status == "Delivered")
                {
                    throw new Exception("Can't Cancel Order Because it is Shipped");
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
                    return true;
                }
                return true;

            }
            catch
            {
                return false;
            }
        }
    }
}
