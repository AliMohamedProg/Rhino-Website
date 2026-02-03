using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Context;
using DAL.Contracts;
using Domains;
using Microsoft.EntityFrameworkCore;
using DAL.Exceptions;
using Microsoft.Extensions.Logging;
using DAL.Migrations;
using System.Linq.Expressions;


namespace DAL.Repositories
{
    public class TableRepository<T> : ITableRepository<T> where T : BaseTable
    {
        private readonly WoodDecorContext _context;
        private readonly DbSet<T> _dbSet;
        private readonly ILogger<TableRepository<T>> _logger;
        public TableRepository(WoodDecorContext context, ILogger<TableRepository<T>> logger)
        {
            _context = context;
            _dbSet = _context.Set<T>();
            _logger = logger;
        }

        public List<T> GetAll()
        {
            try
            {
                return _dbSet.Where(a => a.CurrentState > 0).ToList();
            }
            catch (Exception ex)

            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public List<T> GetDeletedItems()
        {
            try
            {
                return _dbSet.Where(a => a.CurrentState == 0).ToList();
            }
            catch (Exception ex)

            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public T GetById(Guid id)
        {
            try
            {
                return _dbSet.Where(a => a.Id == id).AsNoTracking().FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public T Restore(Guid id)
        {
            try
            {
                var data = GetById(id);
                _dbSet.Attach(data);
                data.UpdatedBy = data.UpdatedBy;
                data.UpdatedDate = DateTime.Now;
                data.CurrentState = 1;

                _context.SaveChanges();

                return data;
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public bool Add(T entity)
        {
            try
            {
                entity.CreatedDate = DateTime.Now;
                entity.CurrentState = 1;
                //  entity.CreatedBy = 


                _dbSet.Add(entity);

                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public bool Add(T entity, out Guid id)
        {
            try
            {
                entity.CreatedDate = DateTime.Now;
                entity.CurrentState = 1;
                //  entity.CreatedBy = 
                _dbSet.Add(entity);

                _context.SaveChanges();
                id = entity.Id;
                return true;
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public bool Update(T entity)
        {
            try
            {
                var data = GetById(entity.Id);

                entity.UpdatedBy = data.UpdatedBy;
                entity.UpdatedDate = DateTime.Now;
                entity.CreatedBy = data.CreatedBy;
                entity.CreatedDate = data.CreatedDate;
                entity.CurrentState = data.CurrentState;

                _context.Entry(entity).State = EntityState.Modified;
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public bool Delete(Guid id)
        {
            try
            {
                var entity = GetById(id);

                _dbSet.Remove(entity);


                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public bool MarkAsDeleted(Guid id, Guid userId, int status = 0)
        {
            try
            {
                var entity = GetById(id);
                _dbSet.Attach(entity);
                if (entity != null)
                {
                    entity.CurrentState = status;
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }
        public T GetFirstOrDefault(Expression<Func<T, bool>> filter)
        {
            try
            {
                return _dbSet.AsNoTracking().FirstOrDefault(filter);
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }

        public async Task<List<T>> GetList(Expression<Func<T, bool>> filter)
        {
            try
            {
                return _dbSet.AsNoTracking().Where(filter).ToList();
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger);
            }
        }

        public async Task<List<TResult>> GetList<TResult>(Expression<Func<T, bool>>? filter = null, Expression<Func<T, TResult>>? selector = null,
        Expression<Func<T, object>>? orderBy = null, bool isDescending = false, params Expression<Func<T, object>>[] includers)
        {
            try
            {
                IQueryable<T> query = _dbSet.AsQueryable();

                // Apply includes
                foreach (var include in includers)
                    query = query.Include(include);

                // Apply filter
                if (filter != null)
                    query = query.Where(filter);

                // Apply ordering
                if (orderBy != null)
                    query = isDescending
                        ? query.OrderByDescending(orderBy)
                        : query.OrderBy(orderBy);

                query = query.AsNoTracking();

                // Apply projection
                if (selector != null)
                    return await query.Select(selector).ToListAsync();

                return await query.Cast<TResult>().ToListAsync();
            }
            catch (Exception ex)
            {
                throw new DataAccessExption(ex, "", _logger); // Or your custom exception
            }
        }


    }
}
