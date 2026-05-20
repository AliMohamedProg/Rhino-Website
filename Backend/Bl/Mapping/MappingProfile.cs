using System;
using System.Collections.Generic;
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
            CreateMap<TbCategory, CategoryDto>().ReverseMap();
            CreateMap<TbProjects, ProjectsDto>().ReverseMap();
            CreateMap<TbProjectImages, ProjectImagesDto>().ReverseMap();
            CreateMap<TbProjectProducts, ProjectProductsDto>().ReverseMap();
            CreateMap<TbAlliances, AlliancesDto>().ReverseMap();
            CreateMap<TbItemFabrics,ItemFabricsDto>().ReverseMap();
            CreateMap<TbImage, ImageDto>().ReverseMap();
            CreateMap<TbItem, ItemDto>().ReverseMap();
            CreateMap<TbOrder, OrderDto>().ReverseMap();
            CreateMap<TbOrderItem, OrderItemDto>().ReverseMap();
            CreateMap<TbReview, ReviewDto>().ReverseMap();
            CreateMap<TbSetting, SettingDto>().ReverseMap();
            CreateMap<TbSlider, SliderDto>().ReverseMap();
            CreateMap<TbRefreshTokens, RefreshTokensDto>().ReverseMap();
            CreateMap<TbCart, CartDto>().ReverseMap();
            CreateMap<TbCartItem, CartItemDto>().ReverseMap();
            CreateMap<TbStyles, StylesDto>().ReverseMap();
            CreateMap<TbCollections, CollectionDto>()
                .ForMember(dest => dest.Changes, 
                    opt => opt.MapFrom(src => src.TbChanges))
                .ForMember(dest => dest.CollectionImages, 
                    opt => opt.MapFrom(src => src.TbCollectionImages))
                .ForMember(dest => dest.CollectionFabrics, 
                    opt => opt.MapFrom(src => src.TbCollectionFabrics))
                .ForMember(dest => dest.CollectionItems, 
                    opt => opt.MapFrom(src => src.TbCollectionItems))
                .ReverseMap()
                .ForMember(dest => dest.TbChanges, 
                    opt => opt.MapFrom(src => src.Changes))
                .ForMember(dest => dest.TbCollectionImages, 
                    opt => opt.MapFrom(src => src.CollectionImages))
                .ForMember(dest => dest.TbCollectionFabrics, 
                    opt => opt.MapFrom(src => src.CollectionFabrics))
                .ForMember(dest => dest.TbCollectionItems, 
                    opt => opt.MapFrom(src => src.CollectionItems));
            CreateMap<TbCollectionFabrics, CollectionFabricsDto>().ReverseMap();
            CreateMap<TbCollectionImages, CollectionImagesDto>().ReverseMap();
            CreateMap<TbCollectionItems, CollectionItemsDto>()
                .ForMember(dest => dest.Item, opt => opt.MapFrom(src => src.Item)) // ✅
                .ReverseMap();
            CreateMap<TbChanges, ChangeDto>()
                .ForMember(dest => dest.ChangeImages, 
                    opt => opt.MapFrom(src => src.TbChangeImages))
                .ReverseMap()
                .ForMember(dest => dest.TbChangeImages, 
                    opt => opt.MapFrom(src => src.ChangeImages));
            CreateMap<TbChangeImages, ChangeImagesDto>().ReverseMap();
            CreateMap<TbTypes, TypesDto>().ReverseMap();
        }
    }
}
