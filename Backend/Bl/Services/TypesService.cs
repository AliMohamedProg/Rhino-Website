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
    public class StylesService : BaseService<TbStyles, StylesDto>, IStyles
    {
        ITableRepository<TbStyles> repository;
        IMapper _Mapper;
        public StylesService(ITableRepository<TbStyles> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
            repository = _repository;
                this._Mapper = _Mapper;
        }


        public override List<StylesDto> GetAll()
        {
            var listTask = repository.GetList<TbStyles>(
                a => a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false
            );
            var list = listTask.GetAwaiter().GetResult();
            return _Mapper.Map<List<TbStyles>, List<StylesDto>>(list);
        }
    }
}
