using Bl.Contracts;
using Bl.DTOs;
using Domains;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<CartDto> GetCart()
        {
            var userId = _userService.GetLoggedInUser();
            var cart = await _cartService.GetActiveCart(userId);
            if (cart == null)
                return new CartDto { Items = new List<CartItemDto>(), CartTotal = 0 };
            return cart;
        }

        // GET: api/<CartController>/item/{productId}
        [Authorize]
        [HttpGet("item/{productId}")]
        public async Task<ActionResult<CartItemDto>> GetCartItem(Guid productId)
        {
            var userId = _userService.GetLoggedInUser();
            var item = await _cartService.GetCartItem(userId, productId);
            if (item == null) return NotFound();
            return item;
        }

        // POST: api/<CartController>/item
        [Authorize]
        [HttpPost("item")]
        public async Task<ActionResult<bool>> AddCartItem([FromBody] AddCartItemRequest request)
        {
            var userId = _userService.GetLoggedInUser();
            var ok = await _cartService.AddToCart(userId, request.ProductId, request.Quantity);
            return ok;
        }

        // PUT: api/<CartController>/item/{productId}
        [Authorize]
        [HttpPut("item/{productId}")]
        public async Task<ActionResult<bool>> UpdateCartItem(Guid productId, [FromBody] UpdateCartItemRequest request)
        {
            var userId = _userService.GetLoggedInUser();
            var ok = await _cartService.UpdateCartItem(userId, productId, request.Quantity);
            if (!ok) return NotFound();
            return ok;
        }
    }

    public class AddCartItemRequest
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }
}
