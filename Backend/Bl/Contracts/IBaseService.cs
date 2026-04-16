using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domains;

namespace Bl.Contracts
{
    public interface IBaseService<T,Dto>
    {
        List<Dto> GetAll();
        List<Dto> GetDeletedItems();
        Dto GetById(Guid id);
        bool Add(Dto entity);
        bool Add(Dto entity, out Guid id);
        bool Update(Dto entity);
        bool MarkAsDeleted(Guid id, int status = 0);
        bool Delete(Guid id);
        bool DeleteAll();
        Dto Restore(Guid id);

    }
}
