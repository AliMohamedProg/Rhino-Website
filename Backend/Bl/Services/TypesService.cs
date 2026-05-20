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
    public class TypesService : BaseService<TbTypes, TypesDto>, ITypes
    {
        ITableRepository<TbTypes> repository;
        IMapper _Mapper;
        public TypesService(ITableRepository<TbTypes> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
            repository = _repository;
                this._Mapper = _Mapper;
        }


        public override List<TypesDto> GetAll()
        {
            var listTask = repository.GetList<TbTypes>(
                a => a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false
            );
            var list = listTask.GetAwaiter().GetResult();
            return _Mapper.Map<List<TbTypes>, List<TypesDto>>(list);
        }
    }
}
