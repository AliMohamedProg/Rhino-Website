using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FabricsController : ControllerBase
    {
        private readonly IFabrics _fabricsService;

        public FabricsController(IFabrics fabricsService)
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
    }
}