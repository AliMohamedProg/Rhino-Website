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
        ISlider _categoryService;
        public SliderController(ISlider categoryService)
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
    }
}
