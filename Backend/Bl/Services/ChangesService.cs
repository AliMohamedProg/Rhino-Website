using System;
using System.Collections;
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
    public class ChangesService : BaseService<TbChanges, ChangeDto>, IChanges
    {
        ITableRepository<TbChanges> repository;
        ITableRepository<TbCollections> _CollectionRepository;
        ITableRepository<TbChangeImages> _ChangeImageRepository;
        IMapper _Mapper;
        public ChangesService(ITableRepository<TbChanges> _repository, IMapper _Mapper, IUserService userService,
            ITableRepository<TbCollections> CollectionRepository,ITableRepository<TbChangeImages> ChangeImageRepository)
            : base(_repository, _Mapper, userService)
        {
            repository = _repository;
            this._Mapper = _Mapper;
            _CollectionRepository = CollectionRepository;
            _ChangeImageRepository = ChangeImageRepository;
        }
        

        public CollectionDto GetCollectionWithChange(Guid collectionId, Guid? changeId)
        {
            var collection = _CollectionRepository.GetById(collectionId);
            if (collection == null) return null;
        
            var collectionDto = Mapper.Map<TbCollections, CollectionDto>(collection);
        
            if (changeId == null) return collectionDto; // return base collection
        
            var change = repository.GetById(changeId.Value);
            if (change == null) return collectionDto;
        
            // Override base collection fields with change fields
            if (!string.IsNullOrEmpty(change.NewName))
                collectionDto.Name = change.NewName;
            if (!string.IsNullOrEmpty(change.NewDescription))
                collectionDto.Description = change.NewDescription;
            if (!string.IsNullOrEmpty(change.NewDimensions))
                collectionDto.Dimensions  = change.NewDimensions;
            if (!string.IsNullOrEmpty(change.NewSKU))  
                collectionDto.SKU = change.NewSKU;
            if (change.OverPrice > 0) 
                collectionDto.Price  = collection.Price + change.OverPrice;
        
            // Override images if change has its own images
            var changeImages = _ChangeImageRepository.GetAll().Where(x => x.ChangeId == change.Id).ToList();
                
        
            if (changeImages.Any())
            {
                collectionDto.MainImage = changeImages.First().ImageUrl;
                collectionDto.CollectionImages = changeImages.Select(ci => new CollectionImagesDto
                {
                    Id = ci.Id,
                    ImageUrl = ci.ImageUrl,
                    CurrentState = ci.CurrentState,
                    CreatedDate = ci.CreatedDate
                }).ToList();
            }
        
            return collectionDto;
        }
    }
}
