using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlliancesController : ControllerBase
    {
        private readonly IAlliances _alliancesService;

        public AlliancesController(IAlliances alliaceService)
        {
            _alliancesService = alliaceService;
        }

        // GET: api/Slider
        [HttpGet]
        public ActionResult<IEnumerable<AlliancesDto>> Get()
        {
            try
            {
                var alliances = _alliancesService.GetAll();
                if (alliances == null)
                {
                    return Ok(new List<AlliancesDto>());
                }
                return Ok(alliances);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}