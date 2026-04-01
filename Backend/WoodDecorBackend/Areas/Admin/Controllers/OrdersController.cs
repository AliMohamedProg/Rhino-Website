using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text;

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

        [HttpGet("export/excel")]
        public async Task<IActionResult> ExportOrdersToExcel()
        {
            var orders = await _orderService.GetAllOrders();

            var sb = new StringBuilder();
            sb.AppendLine("Id,OrderNumber,OrderDate,FirstName,LastName,Email,PhoneNumber,Total,Status,PaymentStatus");

            foreach (var o in orders)
            {
                var row = string.Join(",", new[]
                {
                    o.Id.ToString(),
                    EscapeCsv(o.OrderNumber),
                    o.OrderDate.ToString("yyyy-MM-dd HH:mm:ss"),
                    EscapeCsv(o.FirstName),
                    EscapeCsv(o.LastName),
                    EscapeCsv(o.Email),
                    EscapeCsv(o.PhoneNumber),
                    o.Total.ToString("0.##"),
                    EscapeCsv(o.Status),
                    EscapeCsv(o.PaymentStatus)
                });
                sb.AppendLine(row);
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "text/csv", "orders.csv");
        }

        [HttpGet("export/pdf")]
        public async Task<IActionResult> ExportOrdersToPdf()
        {
            var orders = await _orderService.GetAllOrders();

            var sb = new StringBuilder();
            sb.AppendLine("Orders Export");
            sb.AppendLine("=============");
            foreach (var o in orders)
            {
                sb.AppendLine($"Id: {o.Id}");
                sb.AppendLine($"Order Number: {o.OrderNumber}");
                sb.AppendLine($"Date: {o.OrderDate:yyyy-MM-dd HH:mm}");
                sb.AppendLine($"Customer: {o.FirstName} {o.LastName}");
                sb.AppendLine($"Email: {o.Email}");
                sb.AppendLine($"Phone: {o.PhoneNumber}");
                sb.AppendLine($"Total: {o.Total:0.##}");
                sb.AppendLine($"Status: {o.Status}");
                sb.AppendLine($"Payment: {o.PaymentStatus}");
                sb.AppendLine(new string('-', 40));
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "application/pdf", "orders.pdf");
        }

        private static string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            var needsQuotes = value.Contains(',') || value.Contains('"') || value.Contains('\n');
            var escaped = value.Replace("\"", "\"\"");
            return needsQuotes ? $"\"{escaped}\"" : escaped;
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
