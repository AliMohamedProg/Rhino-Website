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
    public class CollectionsImagesService : BaseService<TbCollectionImages, CollectionImagesDto>, ICollectionsImages
    {
        ITableRepository<TbCollectionImages> repository;
        IMapper _Mapper;
        public CollectionsImagesService(ITableRepository<TbCollectionImages> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
            repository = _repository;
                this._Mapper = _Mapper;
        }


        public override List<CollectionImagesDto> GetAll()
        {
            var listTask = repository.GetList<TbCollectionImages>(
                a => a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false
            );
            var list = listTask.GetAwaiter().GetResult();
            return _Mapper.Map<List<TbCollectionImages>, List<CollectionImagesDto>>(list);
        }
    }
}