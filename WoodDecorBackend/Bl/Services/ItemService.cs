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
    public class ItemService : BaseService<TbItem, ItemDto>, IItem
    {
        public ItemService(ITableRepository<TbItem> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
        }
    }
}
