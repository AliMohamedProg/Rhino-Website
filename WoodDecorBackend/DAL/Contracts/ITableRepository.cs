using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Domains;

namespace DAL.Contracts
{
    public interface ITableRepository<T> where T : BaseTable
    {
        List<T> GetAll();
        List<T> GetDeletedItems();
        T Restore(Guid id);
        IQueryable<T> Query();
        T GetById(Guid id);
        bool Add(T entity);
        bool Add(T entity, out Guid id);
        bool Update(T entity);
        bool Delete(Guid id);
        Task<int> GetUserCount();
        bool MarkAsDeleted(Guid id, Guid userId, int status = 0);
        T GetFirstOrDefault(Expression<Func<T, bool>> filter);
        Task<List<T>> GetList(Expression<Func<T, bool>> filter);
        Task<int> CountAsync(Expression<Func<T, bool>>? filter = null);
        Task<List<TResult>> GetList<TResult>(Expression<Func<T, bool>>? filter = null, Expression<Func<T, TResult>>? selector = null, 
        Expression<Func<T, object>>? orderBy = null, bool isDescending = false, params Expression<Func<T, object>>[] includers);
    }
}
