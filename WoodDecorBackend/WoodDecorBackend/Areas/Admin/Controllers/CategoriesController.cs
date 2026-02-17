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
    public class CategoriesController : ControllerBase
    {
        ICategory _categoryService;
        public CategoriesController(ICategory categoryService)
        {
            _categoryService = categoryService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public List<CategoryDto> Get()
        {
            var categories = _categoryService.GetAll();
            return categories;
        }

        [HttpPost("add-category")]
        public async Task<bool> Add(CategoryDto categoryDto)
        {
            try
            {
                var category = new CategoryDto()
                {
                    NameAr = categoryDto.NameAr,
                    NameEn = categoryDto.NameEn,
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

        [HttpPost("edit-category")]
        public async Task<bool> Edit(CategoryDto categoryDto)
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

        [HttpPost("delete-category/{categoryId}")]
        public async Task<IActionResult> Delete([FromRoute] Guid categoryId)
        {
            try
            {
                var result = _categoryService.MarkAsDeleted(categoryId, 0); // Soft delete
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
