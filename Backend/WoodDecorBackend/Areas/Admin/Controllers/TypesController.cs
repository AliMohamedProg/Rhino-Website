using Bl.DTOs;
using Bl.Services;
using BusinessLayer.Contracts;
using Domains;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text;
using Bl;
using Bl.Contracts;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Areas.Admin.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class TypesController : ControllerBase
    {
        ITypes _typesService;
        public TypesController(ITypes typesService)
        {
            _typesService = typesService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public List<TypesDto> Get()
        {
            var categories = _typesService.GetAll();
            return categories;
        }

        [HttpPost("add-type")]
        public async Task<bool> Add(TypesDto categoryDto)
        {
            try
            {
                var category = new TypesDto()
                {
                    Name = categoryDto.Name,
                    CurrentState =1,
                    Id = Guid.NewGuid(),
                };
                _typesService.Add(category);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("edit-type")]
        public async Task<bool> Edit(TypesDto categoryDto)
        {
            try
            {
                _typesService.Update(categoryDto);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("delete-type/{typeId}")]
        public async Task<IActionResult> Delete([FromRoute] Guid typeId)
        {
            try
            {
                var result = _typesService .MarkAsDeleted(typeId, 0); // Soft delete
                if (result)
                    return Ok(new { success = true, message = "Category deleted successfully" });
                
                return NotFound(new { success = false, message = "Category not found in database" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
        [HttpPost("delete-all-types")]
        public async Task<IActionResult> Delete()
        {
            try
            {
                var result = _typesService.DeleteAll();
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
