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
    public class CollectionsFabricsService : BaseService<TbCollectionFabrics, CollectionFabricsDto>, ICollectionsFabrics
    {
        ITableRepository<TbCollectionFabrics> repository;
        IMapper _Mapper;
        public CollectionsFabricsService(ITableRepository<TbCollectionFabrics> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
            repository = _repository;
                this._Mapper = _Mapper;
        }


        public override List<CollectionFabricsDto> GetAll()
        {
            var listTask = repository.GetList<TbCollectionFabrics>(
                a => a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false
            );
            var list = listTask.GetAwaiter().GetResult();
            return _Mapper.Map<List<TbCollectionFabrics>, List<CollectionFabricsDto>>(list);
        }
    }
}