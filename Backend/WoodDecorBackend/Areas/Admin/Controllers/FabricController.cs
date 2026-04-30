using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class FabricController : ControllerBase
    {
        private readonly IFabrics _fabricsService;

        public FabricController(IFabrics fabricsService)
        {
            _fabricsService = fabricsService;
        }

        // GET: api/Slider
        [HttpGet]
        public ActionResult<IEnumerable<FabricsDto>> Get()
        {
            try
            {
                var fabrics = _fabricsService.GetAll();
                if (fabrics == null)
                {
                    return Ok(new List<FabricsDto>());
                }
                return Ok(fabrics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        [HttpPost("add-fabric")]
        public async Task<bool> Add(FabricsDto categoryDto)
        {
        
            try
            {
                var category = new FabricsDto()
                {
                    Name = categoryDto.Name,
                    ImageUrl = categoryDto.ImageUrl,
                    CurrentState =1,
                    Id = Guid.NewGuid(),

                };
                _fabricsService.Add(category);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        
        [HttpPost("edite-fabric")]
        public async Task<bool> edit(FabricsDto categoryDto)
        {
        
            try
            {
                _fabricsService.Update(categoryDto);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }

}
