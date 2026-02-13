using System;
using System.Collections.Generic;
using System.Text;
using DAL.Context;
using DAL.Contracts;
using Domains;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DAL.Repositories
{
    public class CartRepository : TableRepository<TbCart>, ICartRepository
    {
        WoodDecorContext _context; // Expose the context as the derived type
        public CartRepository(
                WoodDecorContext context,
                ILogger<CartRepository> logger)     // ← note: ILogger<CartRepository> (not the generic base one)
                : base(context, logger)             // ← pass both to base
        {
            // no need to assign _context again — base already did it
            _context = context;

        }

        public async Task<TbCart> GetActiveCartWithItemsAsync(Guid userId)
        {
            return await _context.TbCart
                .Include(c => c.Items)
                .ThenInclude(i => i.Item)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.CurrentState == 1);
        }

        public async Task<TbCartItem> GetCartItem(Guid userId, Guid itemId)
        {
            return await _context.TbCartItem
                .Include(i => i.Item)
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.UserId == userId && i.ItemId == itemId && i.Cart.CurrentState == 1);
        }

        public async Task UpdateCartItem(TbCartItem item)
        {
            _context.TbCartItem.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task AddCartItem(TbCartItem cartItem)
        {
            var cart = await GetActiveCartWithItemsAsync(cartItem.UserId);
            if (cart == null)
            {
                cart = new TbCart
                {
                    Id = Guid.NewGuid(),
                    UserId = cartItem.UserId,
                    CurrentState = 1,
                    CreatedBy = cartItem.UserId,
                    CreatedDate = DateTime.UtcNow
                };
                _context.TbCart.Add(cart);
                await _context.SaveChangesAsync();
            }
            cartItem.CartId = cart.Id;
            var product = await _context.TbItems.FindAsync(cartItem.ItemId);
            if (product != null)
            {
                cartItem.Price = product.Price;
                cartItem.Total = product.Price * cartItem.Quantity;
                cartItem.NameEn = product.NameEn;
                cartItem.NameAr = product.NameAr;
                cartItem.Image = product.MainImage;
            }
            _context.TbCartItem.Add(cartItem);
            await _context.SaveChangesAsync();
        }
    }

}
