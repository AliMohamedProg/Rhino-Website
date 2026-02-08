using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        IItem _itemService;
        public ItemsController(IItem itemService)
        {
            _itemService = itemService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public List<ItemDto> Get()
        {
            var items = _itemService.GetAll();
            return items;
        }

        // GET api/<ItemsController>/5
        [HttpGet("{id}")]
        public ItemDto GetItemDetails(Guid id)
        {
            var item = _itemService.GetById(id);
            return item;
        }

    }
}
