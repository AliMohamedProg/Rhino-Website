using Bl.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Areas.Admin.Controllers
{
    [Route("api/admin/users")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("export/excel")]
        public async Task<IActionResult> ExportUsersToExcel()
        {
            var users = await _userService.GetAllUsersAsync();

            var sb = new StringBuilder();
            sb.AppendLine("Id,FirstName,LastName,Email,PhoneNumber,TotalOrders,TotalSpent");

            foreach (var u in users)
            {
                sb.AppendLine(string.Join(",", new[]
                {
                    u.Id.ToString(),
                    EscapeCsv(u.FirstName),
                    EscapeCsv(u.LastName),
                    EscapeCsv(u.Email),
                    EscapeCsv(u.PhoneNumber),
                    u.TotalOrders.ToString(),
                    u.TotalSpent.ToString("0.##")
                }));
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "text/csv", "users.csv");
        }

        [HttpGet("export/pdf")]
        public async Task<IActionResult> ExportUsersToPdf()
        {
            var users = await _userService.GetAllUsersAsync();

            var sb = new StringBuilder();
            sb.AppendLine("Users Export");
            sb.AppendLine("===========");
            foreach (var u in users)
            {
                sb.AppendLine($"Id: {u.Id}");
                sb.AppendLine($"Name: {u.FirstName} {u.LastName}");
                sb.AppendLine($"Email: {u.Email}");
                sb.AppendLine($"Phone: {u.PhoneNumber}");
                sb.AppendLine($"Total Orders: {u.TotalOrders}");
                sb.AppendLine($"Total Spent: {u.TotalSpent:0.##}");
                sb.AppendLine(new string('-', 40));
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "application/pdf", "users.pdf");
        }

        private static string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            var needsQuotes = value.Contains(',') || value.Contains('"') || value.Contains('\n');
            var escaped = value.Replace("\"", "\"\"");
            return needsQuotes ? $"\"{escaped}\"" : escaped;
        }
    }

}
