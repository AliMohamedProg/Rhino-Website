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
    }

}
