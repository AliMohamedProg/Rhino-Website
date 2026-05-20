using Bl;
using Bl.DTOs;
using Bl.Services;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;
using Bl.Contracts;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypesController : ControllerBase
    { 
        IItem _itemService;
        ITypes _typesService;
        public TypesController(ITypes typesService)
        {
            _typesService = typesService;
        }
        
        // GET: api/<CategoryController>
        [HttpGet]
        public List<TypesDto> Get()
        {
            var categories = _typesService.GetAll();
            return categories;
        }
        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        public List<ItemDto> GetTypeItems(Guid id)
        {
            var itemsCategory = _itemService.GetAll().Where(a => a.TypeId == id).ToList();
            return itemsCategory;
        }
    }
}
