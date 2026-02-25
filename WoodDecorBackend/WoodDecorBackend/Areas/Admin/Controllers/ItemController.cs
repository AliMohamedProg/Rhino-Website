using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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
                    //OverallRating = itemDto.OverallRating,
                    Price = itemDto.Price,
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
                    return Ok(new { success = true, message = "Category deleted successfully" });

                return NotFound(new { success = false, message = "Category not found in database" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
    }
}
