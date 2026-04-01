using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SliderController : ControllerBase
    {
        private readonly ISlider _sliderService;

        public SliderController(ISlider sliderService)
        {
            _sliderService = sliderService;
        }

        // GET: api/Slider
        [HttpGet]
        public ActionResult<IEnumerable<SliderDto>> Get()
        {
            try
            {
                var sliders = _sliderService.GetAll();
                if (sliders == null)
                {
                    return Ok(new List<SliderDto>());
                }
                return Ok(sliders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
