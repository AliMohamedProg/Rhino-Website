using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Domains;

namespace DAL.Contracts
{
    public interface ICartRepository : ITableRepository<TbCart>
    {
        Task<TbCart> GetActiveCartWithItemsAsync(Guid userId);
        Task<TbCartItem?> GetCartItem(Guid userId, Guid productId);
        Task UpdateCartItem(TbCartItem item);
        Task AddCartItem(TbCartItem item);
        Task<bool> DeleteCart(Guid userId);
        Task<bool> DeleteCartItem(Guid userId,Guid productId);
        Task<decimal> GetProductPrice(Guid productId);
        Task<TbCart> AddCart(TbCart cart);
    }

}
