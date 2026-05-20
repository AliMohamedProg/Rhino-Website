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
                    Name = categoryDto.Name,
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
        [HttpPost("delete-all-categories")]
        public async Task<IActionResult> Delete()
        {
            try
            {
                var result = _categoryService.DeleteAll();
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
