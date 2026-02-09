using AutoMapper;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Services;
using DAL.Contracts;
using Domains;

public class CartService : BaseService<TbCart, CartDto>
{
    ICartRepository _cartRepository;
    public CartService(ITableRepository<TbCart> _repository, IMapper _Mapper, IUserService userService , ICartRepository cartRepository)
            : base(_repository, _Mapper, userService)
    {
        _cartRepository = cartRepository;
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
