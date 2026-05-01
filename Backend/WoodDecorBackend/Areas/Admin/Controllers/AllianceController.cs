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
    public class AllianceController : ControllerBase
    {
        private readonly IAlliances _alliancesService;

        public AllianceController(IAlliances alliancesService)
        {
            _alliancesService = alliancesService;
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
        
        [HttpPost("add-alliance")]
        public async Task<bool> Add(AlliancesDto alliancesDto)
        {
            try
            {
                var alliance = new AlliancesDto()
                {
                    Name = alliancesDto.Name,
                    ImageUrl = alliancesDto.ImageUrl,
                    CurrentState = 1,
                    Id = Guid.NewGuid(),
                };
                _alliancesService.Add(alliance);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        
        [HttpPost("edit-alliance")]
        public async Task<bool> edit(AlliancesDto alliancesDto)
        {
            try
            {
                _alliancesService.Update(alliancesDto);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("delete-alliance/{id}")]
        public async Task<bool> Delete(Guid id)
        {
            try
            {
                _alliancesService.Delete(id);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }

}
