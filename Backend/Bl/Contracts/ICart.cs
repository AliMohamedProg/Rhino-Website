using System;
using System.Collections.Generic;
using System.Text;
using Bl.DTOs;
using Domains;

namespace Bl.Contracts
{
    public interface ICart : IBaseService<TbCart, CartDto>
    {
        Task<CartDto> GetActiveCart(Guid userId);
        Task<bool> AddToCart(Guid userId, Guid productId, int quantity, string color, string fabric);
        Task<CartItemDto?> GetCartItem(Guid userId, Guid productId);
        Task<bool> UpdateCartItem(Guid userId, Guid productId, int quantity);
        Task<bool> DeleteCart(Guid userId);
        Task<bool> DeleteCartItem(Guid userId, Guid itemId);
    }
}
