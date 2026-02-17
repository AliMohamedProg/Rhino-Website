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
    public class OrderItemService : BaseService<TbOrderItem, OrderItemDto>, IOrderItem
    {
        ITableRepository<TbOrderItem> tableRepository;
        public OrderItemService(ITableRepository<TbOrderItem> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
            tableRepository = _repository;
        }

        //public async Task<OrderItemDto> GetAllUserOrderItem(Guid userId)
        //{

        //}
    }
}
