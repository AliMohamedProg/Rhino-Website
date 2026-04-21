using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Areas.Admin.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ItemController : ControllerBase
    {
        IItem _itemService;
        public ItemController(IItem itemService)
        {
            _itemService = itemService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public List<ItemDto> Get()
        {
            var items = _itemService.GetAllItemsWithImages();
            return items;
        }

        [HttpGet("export/excel")]
        public IActionResult ExportItemsToExcel()
        {
            var items = _itemService.GetAllItemsWithImages();

            var sb = new StringBuilder();
            sb.AppendLine("Id,NameEn,NameAr,Price,DiscountAmount,StockNumber,CategoryId");

            foreach (var item in items)
            {
                var row = string.Join(",", new[]
                {
                    item.Id.ToString(),
                    EscapeCsv(item.NameEn),
                    EscapeCsv(item.NameAr),
                    item.Price.ToString("0.##"),
                    item.DiscountAmount?.ToString() ?? string.Empty,
                    item.StockNumber.ToString(),
                    item.CategoryId.ToString()
                });
                sb.AppendLine(row);
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "text/csv", "products.csv");
        }

        [HttpGet("export/pdf")]
        public IActionResult ExportItemsToPdf()
        {
            var items = _itemService.GetAllItemsWithImages();

            var sb = new StringBuilder();
            sb.AppendLine("Products Export");
            sb.AppendLine("===============");
            foreach (var item in items)
            {
                sb.AppendLine($"Id: {item.Id}");
                sb.AppendLine($"Name (EN): {item.NameEn}");
                sb.AppendLine($"Name (AR): {item.NameAr}");
                sb.AppendLine($"Price: {item.Price:0.##}");
                sb.AppendLine($"Discount: {item.DiscountAmount}");
                sb.AppendLine($"Stock: {item.StockNumber}");
                sb.AppendLine(new string('-', 40));
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "application/pdf", "products.pdf");
        }

        private static string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            var needsQuotes = value.Contains(',') || value.Contains('"') || value.Contains('\n');
            var escaped = value.Replace("\"", "\"\"");
            return needsQuotes ? $"\"{escaped}\"" : escaped;
        }

        [HttpPost("add-item")]
        public async Task<bool> Add(ItemDto itemDto)
        {
            try
            {
                var mainImage = itemDto.MainImage;
                if (string.IsNullOrWhiteSpace(mainImage) && itemDto.Images != null && itemDto.Images.Count > 0)
                {
                    mainImage = itemDto.Images[0].ImageUrl;
                }

                if (itemDto.DiscountAmount.GetValueOrDefault() > 0)
                {
                    itemDto.OldPrice = itemDto.Price;
                    itemDto.Price = itemDto.Price - (itemDto.Price * ((decimal)itemDto.DiscountAmount.Value / 100m));
                }
                else
                {
                    itemDto.OldPrice = itemDto.Price;
                }
                
                var item = new ItemDto()
                {
                    CurrentState = 1,
                    Id = Guid.NewGuid(),
                    NameAr = itemDto.NameAr,
                    NameEn = itemDto.NameEn,
                    DescriptionAr = itemDto.DescriptionAr,
                    DescriptionEn = itemDto.DescriptionEn,
                    ColorsEn = itemDto.ColorsEn,
                    ColorsAr = itemDto.ColorsAr,
                    DiscountAmount = itemDto.DiscountAmount,
                    MainImage = mainImage ?? string.Empty,
                    //OverallRating = itemDto.OverallRating
                    Price = itemDto.Price, 
                    OldPrice = itemDto.OldPrice,
                    StockNumber = itemDto.StockNumber,
                    CategoryId = itemDto.CategoryId,
                    Images = itemDto.Images ?? new List<ImageDto>(),
                    MaterialEn = itemDto.MaterialEn,
                    MaterialAr = itemDto.MaterialAr,
                };
                _itemService.AddItemWithImages(item);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("edit-item")]
        public async Task<bool> Edit(ItemDto itemDto)
        {
            try
            {
                var mainImage = itemDto.MainImage;
                if (string.IsNullOrWhiteSpace(mainImage) && itemDto.Images != null && itemDto.Images.Count > 0)
                {
                    mainImage = itemDto.Images[0].ImageUrl;
                }

                if (itemDto.DiscountAmount.GetValueOrDefault() > 0)
                {
                    itemDto.OldPrice = itemDto.Price;
                    itemDto.Price = itemDto.Price - (itemDto.Price * ((decimal)itemDto.DiscountAmount.Value / 100m));
                }
                else
                {
                    itemDto.OldPrice = itemDto.Price;
                }

                var item = new ItemDto()
                {
                    Id = itemDto.Id,
                    CurrentState = itemDto.CurrentState,
                    NameAr = itemDto.NameAr,
                    NameEn = itemDto.NameEn,
                    DescriptionAr = itemDto.DescriptionAr,
                    DescriptionEn = itemDto.DescriptionEn,
                    ColorsAr = itemDto.ColorsAr,
                    ColorsEn = itemDto.ColorsEn,
                    DiscountAmount = itemDto.DiscountAmount,
                    MainImage = mainImage ?? string.Empty,
                    //OverallRating = itemDto.OverallRating,
                    Price = itemDto.Price,
                    OldPrice = itemDto.OldPrice,
                    StockNumber = itemDto.StockNumber,
                    CategoryId = itemDto.CategoryId,
                    Images = itemDto.Images ?? new List<ImageDto>(),
                    MaterialAr = itemDto.MaterialAr,
                    MaterialEn = itemDto.MaterialEn,
                };

                _itemService.UpdateItemWithImages(item);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("delete-item/{itemId}")]
        public async Task<IActionResult> Delete([FromRoute] Guid itemId)
        {
            try
            {
                var result = _itemService.MarkAsDeleted(itemId, 0); // Soft delete
                if (result)
                    return Ok(new { success = true, message = "Item deleted successfully" });

                return NotFound(new { success = false, message = "Item not found in database" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
        [HttpPost("delete-all-items")]
        public async Task<IActionResult> Delete()
        {
            try
            {
                var result = _itemService.DeleteAll();
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
