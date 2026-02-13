using AutoMapper;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Services;
using DAL.Contracts;
using Domains;
using Microsoft.EntityFrameworkCore;

public class CartService : BaseService<TbCart, CartDto> , ICart
{
    ICartRepository _cartRepository;
    public CartService(ITableRepository<TbCart> _repository, IMapper _Mapper, IUserService userService , ICartRepository cartRepository)
            : base(_repository, _Mapper, userService)
    {
        _cartRepository = cartRepository;
    }

    public async Task<bool> AddToCart(Guid userId, Guid productId, int quantity)
    {
        try
        {
            var existingItem = await _cartRepository.GetCartItem(userId, productId);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
                existingItem.Total = existingItem.Price * existingItem.Quantity;
                await _cartRepository.UpdateCartItem(existingItem);
            }
            else
            {
                var cartItem = new TbCartItem
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ItemId = productId,
                    Quantity = quantity,
                    CurrentState = 1,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow
                };
                await _cartRepository.AddCartItem(cartItem);
            }
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<CartItemDto?> GetCartItem(Guid userId, Guid productId)
    {
        var item = await _cartRepository.GetCartItem(userId, productId);
        if (item == null) return null;
        return new CartItemDto
        {
            Id = item.Id,
            ItemId = item.ItemId,
            NameEn = item.NameEn,
            NameAr = item.NameAr,
            Image = item.Image,
            Price = item.Price,
            Quantity = item.Quantity,
            Total = item.Total,
            UserId = item.UserId
        };
    }

    public async Task<bool> UpdateCartItem(Guid userId, Guid productId, int quantity)
    {
        try
        {
            var existingItem = await _cartRepository.GetCartItem(userId, productId);
            if (existingItem == null) return false;
            existingItem.Quantity = quantity;
            existingItem.Total = existingItem.Price * quantity;
            await _cartRepository.UpdateCartItem(existingItem);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<CartDto> GetActiveCart(Guid userId)
    {
        var cart = await _cartRepository.GetActiveCartWithItemsAsync(userId);
        if (cart == null) return null;

        var items = cart.Items.Select(i => new CartItemDto
        {
            ItemId = i.ItemId,
            NameEn = i.Item.NameEn,
            Image = i.Item.MainImage,
            Price = i.Total,
            Quantity = i.Quantity,
            Total = i.Total * i.Quantity
        }).ToList();

        return new CartDto
        {
            Id = cart.Id,
            Items = items,
            CartTotal = items.Sum(x => x.Total)
        };
    }


}
