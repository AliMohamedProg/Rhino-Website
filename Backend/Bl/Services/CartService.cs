using AutoMapper;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Services;
using DAL.Contracts;
using Domains;
using Microsoft.EntityFrameworkCore;

public class CartService : BaseService<TbCart, CartDto>, ICart
{
    ICartRepository _cartRepository;
    public CartService(ITableRepository<TbCart> _repository, IMapper _Mapper, IUserService userService, ICartRepository cartRepository)
            : base(_repository, _Mapper, userService)
    {
        _cartRepository = cartRepository;
    }

    public async Task<bool> AddToCart(Guid userId, Guid productId, int quantity, string color)
    {
        var cart = await _cartRepository.GetActiveCartWithItemsAsync(userId);

        if (cart == null)
        {
            // لو مفيش كارت، اعمل واحد جديد
            cart = new TbCart
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CurrentState = 1,
                Items = new List<TbCartItem>()
            };
            await _cartRepository.AddCart(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ItemId == productId && i.Color == color);

        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
            existingItem.Total = existingItem.Price * existingItem.Quantity;
            await _cartRepository.UpdateCartItem(existingItem);
        }
        else
        {
            var newItem = new TbCartItem
            {
                Id = Guid.NewGuid(),
                ItemId = productId,
                Quantity = quantity,
                Color = color,
                Cart = cart, // 🔑 ربط العنصر بالكارت
                Price = await _cartRepository.GetProductPrice(productId),
                Total = await _cartRepository.GetProductPrice(productId) * quantity,
                UserId = userId,
                CreatedBy = userId,
                CurrentState =1,
            };
            cart.Items.Add(newItem);
            await _cartRepository.AddCartItem(newItem);
        }

        return true;
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
            UserId = item.UserId,
            Color = item.Color
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
            NameAr = i.Item.NameAr,
            Image = i.Item.MainImage,
            Price = i.Price,
            Quantity = i.Quantity,
            Total = i.Total,
            Color = i.Color
        }).ToList();

        return new CartDto
        {
            Id = cart.Id,
            Items = items,
            CartTotal = items.Sum(x => x.Total)
        };
    }

    public async Task<bool> DeleteCart(Guid userId)
    {
        try
        {
            return await _cartRepository.DeleteCart(userId);
        }
        catch
        {
            return false;

        }
    }
    public async Task<bool> DeleteCartItem(Guid userId, Guid itemId)
    {
        try
        {
            await _cartRepository.DeleteCartItem(userId, itemId);
            return true;
        }
        catch
        {
            return false;

        }
    }

}
