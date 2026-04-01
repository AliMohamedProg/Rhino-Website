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
    public class CategoryService : BaseService<TbCategory, CategoryDto>, ICategory
    {
        ITableRepository<TbCategory> repository;
        IMapper _Mapper;
        public CategoryService(ITableRepository<TbCategory> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
            repository = _repository;
                this._Mapper = _Mapper;
        }


        public override List<CategoryDto> GetAll()
        {
            var listTask = repository.GetList<TbCategory>(
                a => a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false
            );
            var list = listTask.GetAwaiter().GetResult();
            return _Mapper.Map<List<TbCategory>, List<CategoryDto>>(list);
        }
    }
}
