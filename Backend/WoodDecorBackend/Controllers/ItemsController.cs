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
        public ActionResult<ItemDto> GetItemDetails(Guid id)
        {
            var item = _itemService.GetItemWithImages(id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }
        // GET: api/<ItemsController>/GetTheBestItemsDiscounts
        [HttpGet("best-discounts")]
        public List<ItemDto> GetTheBestItemsDiscounts()
        {
            var items = _itemService.GetAll().Where(a => a.DiscountAmount > 1 && a.DiscountAmount < 100).ToList();
            return items;
        }

    }
}
