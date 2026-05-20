using Bl.DTOs;
using Bl.Services;
using BusinessLayer.Contracts;
using Domains;
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
    public class StylesController : ControllerBase
    {
        IStyles _styleService;
        public StylesController(IStyles styleService)
        {
            _styleService = styleService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public List<StylesDto> Get()
        {
            var styles = _styleService.GetAll();
            return styles;
        }

        [HttpGet("export/excel")]
        public IActionResult ExportCategoriesToExcel()
        {
            var styles = _styleService.GetAll();

            var sb = new StringBuilder();
            sb.AppendLine("Id,NameEn,NameAr,ProductsCount");

            foreach (var cat in styles)
            {
                var row = string.Join(",", new[]
                {
                    cat.Id.ToString(),
                    EscapeCsv(cat.Name),
                    cat.ProductsCount.ToString()
                });
                sb.AppendLine(row);
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "text/csv", "styles.csv");
        }

        [HttpGet("export/pdf")]
        public IActionResult ExportCategoriesToPdf()
        {
            var styles = _styleService.GetAll();

            var sb = new StringBuilder();
            sb.AppendLine("styles Export");
            sb.AppendLine("=================");
            foreach (var cat in styles)
            {
                sb.AppendLine($"Id: {cat.Id}");
                sb.AppendLine($"Name (EN): {cat.Name}");
                sb.AppendLine($"Products Count: {cat.ProductsCount}");
                sb.AppendLine(new string('-', 40));
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "application/pdf", "styles.pdf");
        }

        private static string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            var needsQuotes = value.Contains(',') || value.Contains('"') || value.Contains('\n');
            var escaped = value.Replace("\"", "\"\"");
            return needsQuotes ? $"\"{escaped}\"" : escaped;
        }

        [HttpPost("add-style")]
        public async Task<bool> Add(StylesDto styleDto)
        {
            try
            {
                var style = new StylesDto()
                {
                    Name = styleDto.Name,
                    ImageUrl = styleDto.ImageUrl,
                    CurrentState =1,
                    Id = Guid.NewGuid(),

                };
                _styleService.Add(style);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("edit-style")]
        public async Task<bool> Edit(StylesDto styleDto)
        {
            try
            {
                _styleService.Update(styleDto);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("delete-style/{styleId}")]
        public async Task<IActionResult> Delete([FromRoute] Guid styleId)
        {
            try
            {
                var result = _styleService.MarkAsDeleted(styleId, 0); // Soft delete
                if (result)
                    return Ok(new { success = true, message = "style deleted successfully" });
                
                return NotFound(new { success = false, message = "style not found in database" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
        [HttpPost("delete-all-categories")]
        public async Task<IActionResult> Delete()
        {
            try
            {
                var result = _styleService.DeleteAll();
                if (result)
                    return Ok(new { success = true, message = "Items deleted successfully" });

                return NotFound(new { success = false, message = "Items not found in database" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
    }
}
