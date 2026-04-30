using Apis.Models;
using Bl.Contracts;
using Bl.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICart _cartService;
        private readonly IUserService _userService;

        public CartController(ICart cartService, IUserService userService)
        {
            _cartService = cartService;
            _userService = userService;
        }

        // =============================
        // GET: api/cart
        // =============================
        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var userId = _userService.GetLoggedInUser();

            var cart = await _cartService.GetActiveCart(userId);

            return Ok(cart ?? new CartDto
            {
                Items = new List<CartItemDto>(),
                CartTotal = 0
            });
        }

        // =============================
        // GET: api/cart/items/{productId}
        // =============================
        [HttpGet("items/{productId:guid}")]
        public async Task<ActionResult<CartItemDto>> GetCartItem(Guid productId)
        {
            var userId = _userService.GetLoggedInUser();
            var item = await _cartService.GetCartItem(userId, productId);
            
            if (item == null)
               return NotFound();

           return Ok(item);
        }

        // =============================
        // POST: api/cart/items
        // =============================
        [HttpPost("add-to-cart")]
        public async Task<ActionResult<CartDto>> AddCartItem([FromBody] AddCartItemRequest request)
        {

            
            if (request.Quantity <= 0)
                return BadRequest(new { message = "Quantity must be greater than zero" });

            var userId = _userService.GetLoggedInUser();

            var cart = await _cartService.AddToCart(userId, request.ProductId, request.Quantity, request.Color);

            if (cart == null)
                return NotFound(new { message = "Product not found" });

            return Ok(cart);
        }

        // =============================
        // PATCH: api/cart/items/{productId}
        // =============================
        [HttpPatch("items/{productId:guid}")]
        public async Task<ActionResult<CartDto>> UpdateCartItem(
            Guid productId,
            [FromBody] UpdateCartItemRequest request)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            if (request.Quantity <= 0)
                return BadRequest(new { message = "Quantity must be greater than zero" });

            var userId = _userService.GetLoggedInUser();

            var cart = await _cartService.UpdateCartItem(userId, productId, request.Quantity);

            if (cart == null)
                return NotFound(new { message = "Item not found in cart" });

            return Ok(cart);
        }

        // =============================
        // DELETE: api/cart/items/{productId}
        // =============================
        [HttpDelete("item/delete/{productId:guid}")]
        public async Task<IActionResult> RemoveCartItem(Guid productId)
        {
            var userId = _userService.GetLoggedInUser();

            var removed = await _cartService.DeleteCartItem(userId, productId);

            if (!removed)
                return NotFound(new { message = "Item not found in cart" });

            return NoContent();
        }
    }
}
