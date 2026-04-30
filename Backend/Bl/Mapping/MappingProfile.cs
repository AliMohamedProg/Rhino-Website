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
                
                CreateMap<TbFabrics,FabricsDto>().ReverseMap();
            CreateMap<TbImage, ImageDto>().ReverseMap();
            CreateMap<TbItem, ItemDto>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.TbImages))
                .ReverseMap()
                .ForMember(dest => dest.TbImages, opt => opt.MapFrom(src => src.Images));
            CreateMap<TbOrder, OrderDto>().ReverseMap();
            CreateMap<TbOrderItem, OrderItemDto>()
                .ForMember(dest => dest.NameEn, opt => opt.MapFrom(src =>
                    !string.IsNullOrWhiteSpace(src.nameEn)
                        ? src.nameEn
                        : (src.Item != null ? src.Item.NameEn : null)))
                .ForMember(dest => dest.NameAr, opt => opt.MapFrom(src =>
                    !string.IsNullOrWhiteSpace(src.nameAr)
                        ? src.nameAr
                        : (src.Item != null ? src.Item.NameAr : null)))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src =>
                    !string.IsNullOrWhiteSpace(src.Image)
                        ? src.Image
                        : (src.Item != null ? src.Item.MainImage : null)))
                .ReverseMap();
            CreateMap<TbReview, ReviewDto>().ReverseMap();
            CreateMap<TbSetting, SettingDto>().ReverseMap();
            CreateMap<TbSlider, SliderDto>().ReverseMap();
            CreateMap<TbRefreshTokens, RefreshTokensDto>().ReverseMap();
            CreateMap<TbCart, CartDto>().ReverseMap();
            CreateMap<TbCartItem, CartItemDto>().ReverseMap();
            CreateMap<TbStyles, StylesDto>()
                .ForMember(dest => dest.ProductsCount, opt => opt.MapFrom(src => src.TbItems.Count()))
                .ReverseMap();
        }
    }
}
