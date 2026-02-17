using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Areas.Admin.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CategoriesController : ControllerBase
    {
        ICategory _categoryService;
        public CategoriesController(ICategory categoryService)
        {
            _categoryService = categoryService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public List<CategoryDto> Get()
        {
            var categories = _categoryService.GetAll();
            return categories;
        }

    }
}
