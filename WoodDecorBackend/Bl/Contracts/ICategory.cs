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
    public interface ICategory: IBaseService<TbCategory,CategoryDto>
    {
        // If I Want To Add A New Methods
    }
}
