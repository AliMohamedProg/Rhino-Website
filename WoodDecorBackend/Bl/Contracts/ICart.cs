using System;
using System.Collections.Generic;
using System.Text;
using Bl.DTOs;
using Domains;

namespace Bl.Contracts
{
    public interface ICart : IBaseService<TbCart, CartDto>
    {
        public CartDto GetActiveCart(Guid userId);
    }
}
