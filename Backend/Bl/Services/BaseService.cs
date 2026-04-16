using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Bl.Contracts;
using DAL.Contracts;
using DAL.Exceptions;
using Domains;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services
{
    public class BaseService<T, Dto> : IBaseService<T, Dto> where T : BaseTable
    {
        protected readonly ITableRepository<T> repository;
        protected readonly IMapper Mapper;
        protected readonly IUserService userService;
        public BaseService(ITableRepository<T> _repository, IMapper _Mapper, IUserService userService)
        {
            repository = _repository;
            Mapper = _Mapper;
            this.userService = userService;
        }
        public virtual List<Dto> GetAll()
        {
            var list = repository.GetAll();
            return Mapper.Map<List<T>, List<Dto>>(list);
        }
        public List<Dto> GetDeletedItems()
        {
            var list = repository.GetDeletedItems();
            return Mapper.Map<List<T>, List<Dto>>(list);
        }

        public Dto GetById(Guid id)
        {
            var obj = repository.GetById(id);
            return Mapper.Map<T, Dto>(obj);
        }
        public Dto Restore(Guid id)
        {
            var obj = repository.Restore(id);
            return Mapper.Map<T, Dto>(obj);
        }
        public bool Add(Dto entity)
        {
            var dbObject = Mapper.Map<Dto, T>(entity);
            dbObject.CreatedBy = userService.GetLoggedInUser();

            return repository.Add(dbObject);
        }
        public bool Add(Dto entity, out Guid id)
        {
            var dbObject = Mapper.Map<Dto, T>(entity);
            dbObject.CreatedBy = userService.GetLoggedInUser();
            id = dbObject.Id;
            return repository.Add(dbObject, out id);
        }

        public bool Update(Dto entity)
        {
            var dbObject = Mapper.Map<Dto, T>(entity);
            dbObject.UpdatedBy = userService.GetLoggedInUser();
            return repository.Update(dbObject);
        }

        public bool MarkAsDeleted(Guid id, int status = 0)
        {
            return repository.MarkAsDeleted(id, userService.GetLoggedInUser(), status);

        }
        public bool Delete(Guid id)
        {
            return repository.Delete(id);
        }
        public bool DeleteAll()
        {
            return repository.DeleteAll();
        }
    }
}
