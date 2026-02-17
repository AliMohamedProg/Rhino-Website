using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessLayer.Services;
using AutoMapper;
using Domains;
using Bl.DTOs;

namespace Bl.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
                CreateMap<TbCategory, CategoryDto>().ForMember(dest => dest.ProductsCount,
               opt => opt.MapFrom(src => src.TbItems.Count()))

                .ReverseMap();
            CreateMap<TbImage, ImageDto>().ReverseMap();
            CreateMap<TbItem,ItemDto>().ReverseMap();
            CreateMap<TbOrder, OrderDto>().ReverseMap();
            CreateMap<TbOrderItem, OrderItemDto>()
                .ForMember(dest => dest.NameEn, opt => opt.MapFrom(src => src.Item.NameEn))
                .ForMember(dest => dest.NameAr, opt => opt.MapFrom(src => src.Item.NameAr))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Item.MainImage))
                .ReverseMap();
            CreateMap<TbReview, ReviewDto>().ReverseMap();
            CreateMap<TbSetting, SettingDto>().ReverseMap();
            CreateMap<TbSlider, SliderDto>().ReverseMap();
            CreateMap<TbRefreshTokens, RefreshTokensDto>().ReverseMap();
            CreateMap<TbCart, CartDto>().ReverseMap();
            CreateMap<TbCartItem, CartItemDto>().ReverseMap();
        }
    }
}
