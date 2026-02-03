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
            CreateMap<TbCategory, CategoryDto>().ReverseMap();
            CreateMap<TbImage, ImageDto>().ReverseMap();
            CreateMap<TbItem,ItemDto>().ReverseMap();
            CreateMap<TbOrder, OrderDto>().ReverseMap();
            CreateMap<TbOrderItem, OrderItemDto>().ReverseMap();
            CreateMap<TbReview, ReviewDto>().ReverseMap();
            CreateMap<TbSetting, SettingDto>().ReverseMap();
            CreateMap<TbSlider, SliderDto>().ReverseMap();
        }
    }
}
