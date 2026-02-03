using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using BusinessLayer.Services;
using DAL.Contracts;
using Domains;

namespace Bl.Services
{
    public class SliderService : BaseService<TbSlider, SliderDto>, ISlider
    {
        public SliderService(ITableRepository<TbSlider> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
        }
    }
}
