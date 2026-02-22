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

        public OrderController(IOrder orderService, IUserService userService)
        {
            _orderService = orderService;
            _userService = userService;
        }

        // ------------------ إنشاء Order من Cart ------------------
        [HttpPost("create-from-cart")]
        public async Task<IActionResult> CreateOrderFromCart(AddOrderRequest orderRequest)
        {
            try
            {
                // نفترض إن الـ userId موجود من الـ JWT أو session
                var userId = _userService.GetLoggedInUser();

                var order = await _orderService.CreateOrder(userId , orderRequest.Country, orderRequest.City, orderRequest.Address, orderRequest.Total, orderRequest.PhoneNumber, orderRequest.Email, orderRequest.FirstName, orderRequest.LastName);
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
    }
}
