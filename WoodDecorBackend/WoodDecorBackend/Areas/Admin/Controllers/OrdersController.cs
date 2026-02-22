using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Areas.Admin.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class OrdersController : ControllerBase
    {
        IOrder _orderService;
        public OrdersController(IOrder orderService)
        {
            _orderService = orderService;
        }

        // GET: api/<OrdersController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // هنا يمكنك استدعاء خدمة لجلب كل الطلبات
            var orders = await _orderService.GetAllOrders();
            return Ok(orders);
        }

        [HttpPost("edit-status")]
        public async Task<IActionResult> EditStatus(Guid id, [FromBody] string status)
        {
            await _orderService.UpdateOrderStatus(id, status);

            return Ok();
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> OrderDetails(Guid id)
        {
            var order = await _orderService.GetOrderById(id);

            return Ok(order);
        }
    }
}
