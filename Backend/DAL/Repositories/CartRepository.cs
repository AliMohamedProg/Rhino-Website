using System;
using System.Collections.Generic;
using System.Text;
using DAL.Context;
using DAL.Contracts;
using DAL.Exceptions;
using Domains;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DAL.Repositories
{
    public class CartRepository : TableRepository<TbCart>, ICartRepository
    {
        WoodDecorContext _context; // Expose the context as the derived type
        private readonly DbSet<TbCart> _dbSet;
        public CartRepository(
                WoodDecorContext context,
                ILogger<CartRepository> logger)     // ← note: ILogger<CartRepository> (not the generic base one)
                : base(context, logger)             // ← pass both to base
        {
            // no need to assign _context again — base already did it
            _context = context;
            _dbSet = _context.Set<TbCart>();

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
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task AddCartItem(TbCartItem cartItem)
        {
            if (cartItem == null)
                throw new ArgumentNullException(nameof(cartItem));

            // 1️⃣ جلب الكارت الحالي مع العناصر
            var cart = await GetActiveCartWithItemsAsync(cartItem.UserId);

            // 2️⃣ لو مفيش كارت، اعمل واحد جديد
            if (cart == null)
            {
                cart = new TbCart
                {
                    Id = Guid.NewGuid(),
                    UserId = cartItem.UserId,
                    CurrentState = 1,
                    CreatedBy = cartItem.UserId,
                    CreatedDate = DateTime.UtcNow,
                    Items = new List<TbCartItem>() // مهم جداً
                };

                await _context.TbCart.AddAsync(cart);
            }

            // 3️⃣ اربط CartItem بالكارت
            cartItem.CartId = cart.Id;

            // 4️⃣ جلب بيانات المنتج
            var product = await _context.TbItems
                .AsNoTracking() // قراءة فقط
                .FirstOrDefaultAsync(p => p.Id == cartItem.ItemId);

            if (product == null)
                throw new KeyNotFoundException($"Product with Id {cartItem.ItemId} not found");

            // Calculate true Sale Price
            decimal salePrice = product.Price;
            if (product.OldPrice == null && product.DiscountAmount.GetValueOrDefault() > 0)
            {
                salePrice = product.Price - (product.Price * ((decimal)product.DiscountAmount.Value / 100m));
            }

            // 5️⃣ تعيين بيانات المنتج في CartItem
            cartItem.Price = salePrice;
            cartItem.Total = salePrice * cartItem.Quantity;
            cartItem.NameEn = product.NameEn;
            cartItem.NameAr = product.NameAr;
            cartItem.Image = product.MainImage;

            await _context.TbCartItem.AddAsync(cartItem);


            // 7️⃣ حفظ كل التغييرات مرة واحدة
            await _context.SaveChangesAsync();
        }


        public async Task<bool> DeleteCart(Guid userId)
        {
            try
            {
                var entity = await GetActiveCartWithItemsAsync(userId);

                _dbSet.Remove(entity);


                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteCartItem(Guid userId, Guid itemId)
        {
            try
            {
                var entity = await GetCartItem(userId, itemId);

                if (entity == null) return false;

                _context.TbCartItem.Remove(entity);

                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<decimal> GetProductPrice(Guid productId)
        {
            var product = await _context.TbItems
                .AsNoTracking() // مش محتاج نعمل Tracking عشان بس قراءة
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
                throw new KeyNotFoundException($"Product with Id {productId} not found");

            decimal salePrice = product.Price;
            if (product.OldPrice == null && product.DiscountAmount.GetValueOrDefault() > 0)
            {
                salePrice = product.Price - (product.Price * ((decimal)product.DiscountAmount.Value / 100m));
            }

            return salePrice;
        }
        public async Task<TbCart> AddCart(TbCart cart)
        {
            if (cart == null)
                throw new ArgumentNullException(nameof(cart));

            // تأكد إن الكارت Items مش null
            if (cart.Items == null)
                cart.Items = new List<TbCartItem>();

            await _context.TbCart.AddAsync(cart);

            await _context.SaveChangesAsync(); // حفظ الكارت في DB

            return cart;
        }

    }

}
