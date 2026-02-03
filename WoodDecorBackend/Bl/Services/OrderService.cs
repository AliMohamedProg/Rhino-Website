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
    public class OrderService : BaseService<TbOrder, OrderDto>, IOrder
    {
        public OrderService(ITableRepository<TbOrder> _repository, IMapper _Mapper, IUserService userService)
            : base(_repository, _Mapper, userService)
        {
        }
    }
}
