using Bl.DTOs;
using BusinessLayer.Contracts;
using Domains;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Areas.Admin.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class SlidersController : ControllerBase
    {
        ISlider _categoryService;
        public SlidersController(ISlider categoryService)
        {
            _categoryService = categoryService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public List<SliderDto> Get()
        {
            var categories = _categoryService.GetAll();
            return categories;
        }

        [HttpPost("add-slider")]
        public async Task<bool> Add(SliderDto categoryDto)
        {
            try
            {
                var category = new SliderDto()
                {
                    TitleAr = categoryDto.TitleAr,
                    TitleEn = categoryDto.TitleEn,
                    ImageUrl = categoryDto.ImageUrl,
                    CurrentState =1,
                    Id = Guid.NewGuid(),

                };
                _categoryService.Add(category);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("edit-slider")]
        public async Task<bool> Edit(SliderDto categoryDto)
        {
            try
            {
                _categoryService.Update(categoryDto);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("delete-slider/{sliderId}")]
        public async Task<IActionResult> Delete([FromRoute] Guid sliderId)
        {
            try
            {
                var result = _categoryService.MarkAsDeleted(sliderId, 0); // Soft delete
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
