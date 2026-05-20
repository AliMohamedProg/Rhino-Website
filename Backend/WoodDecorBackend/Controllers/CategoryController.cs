using Bl.DTOs;
using Apis.Models;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        ICategory _categoryService;
        IItem _itemService;
        public CategoryController(ICategory categoryService , IItem itemService)
        {
            _categoryService = categoryService;
            _itemService = itemService;
        }
        // GET: api/<CategoryController>
        [HttpGet]
        public List<CategoryDto> Get()
        {
            var categories = _categoryService.GetAll();
            return categories;
        }
        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        public List<ItemDto> GetCategoryItems(Guid id)
        {
            var itemsCategory = _itemService.GetAll().Where(a => a.CategoryId == id).ToList();
            return itemsCategory;
        }
    }
}
