using System;
using System.Collections.Generic;
using System.Text;
using Domains;

namespace DAL.Contracts
{
    public interface ICartRepository : ITableRepository<TbCart>
    {
        Task<TbCart> GetActiveCartWithItemsAsync(Guid userId);
    }

}
