using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bl.Contracts;
using Bl.DTOs;
using Domains;

namespace BusinessLayer.Contracts
{
    public interface IOrderItem: IBaseService<TbOrderItem,OrderItemDto>
    {
        // If I Want To Add A New Methods
    }
}
