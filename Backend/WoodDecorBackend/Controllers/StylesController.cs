using Bl.DTOs;
using Bl.Services;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StylesController : ControllerBase
    {
        IStyles _stylesService;
        IItem _itemService;
        public StylesController(IStyles stylesService , IItem itemService)
        {
            _stylesService = stylesService;
            _itemService = itemService;
        }
        // GET: api/<CategoryController>
        [HttpGet]
        public List<StylesDto> Get()
        {
            var styles = _stylesService.GetAll();
            return styles;
        }
        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        public List<ItemDto> GetStylesItems(Guid id)
        {
            var itemsCategory = _itemService.GetAll().Where(a => a.StyleId == id).ToList();
            return itemsCategory;
        }
    }
}
