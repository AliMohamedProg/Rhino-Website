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
    public interface IItem: IBaseService<TbItem,ItemDto>
    {
        // If I Want To Add A New Methods
    }
}
