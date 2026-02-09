using Bl.Contracts;
using Bl.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        ICart _cartService;
        IUserService _userService;
        public CartController(ICart cartService , IUserService userService)
        {
            _cartService = cartService;
            _userService = userService;
        }

        // GET: api/<CartController>
        [Authorize]
        [HttpGet]
        public CartDto GetCart()
        {
            var userId = _userService.GetLoggedInUser();

            var cart = _cartService.GetActiveCart(userId);

            if (cart == null)
                return new CartDto { Items = new List<CartItemDto>(), CartTotal = 0 };

            return cart;
        }
    }
}
