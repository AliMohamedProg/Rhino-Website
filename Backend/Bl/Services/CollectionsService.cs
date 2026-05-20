using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using BusinessLayer.Services;
using DAL.Contracts;
using Domains;
using Microsoft.EntityFrameworkCore;

namespace Bl.Services
{
    public class CollectionsService : BaseService<TbCollections, CollectionDto>, ICollections
    {
        private readonly ITableRepository<TbCollectionImages> _imageRepository;
        private readonly ITableRepository<TbCollectionFabrics> _fabricRepository;
        private readonly ITableRepository<TbCollectionItems> _itemRepository;
        public CollectionsService(ITableRepository<TbCollections> _repository, IMapper _Mapper, IUserService userService,
            ITableRepository<TbCollectionImages> imageRepository, ITableRepository<TbCollectionFabrics> fabricRepository,
            ITableRepository<TbCollectionItems> itemRepository)
            : base(_repository, _Mapper, userService)
        {
            _imageRepository = imageRepository;
            _fabricRepository = fabricRepository;
            _itemRepository = itemRepository;
        }

        public async Task<List<CollectionDto>> GetAllCollectionsWithImagesAndFabrics()
        {
            var collections = await repository.GetList<TbCollections>(
                filter: a => a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false,
                a => a.TbCollectionImages,
                a => a.TbCollectionFabrics,
                a => a.TbCollectionItems);
                
            return Mapper.Map<List<TbCollections>, List<CollectionDto>>(collections);
        }

        /*public CollectionDto? GetCollectionWithImagesAndFabrics(Guid id)
        {
            var colletions = repository.GetList<TbCollections>(
                filter: a => a.Id == id && a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false,
                a => a.TbCollectionImages,
                a => a.TbCollectionFabrics,
                a => a.TbCollectionItems,
                a => a.TbChanges
            ).GetAwaiter().GetResult();

            var collection = colletions.FirstOrDefault();
            return collection == null ? null : Mapper.Map<TbCollections, CollectionDto>(collection);
        }*/
        public async Task<CollectionDto?> GetCollectionWithImagesAndFabrics(Guid id)
        {
            var collections = await repository.GetListWithNestedIncludes(
                filter: a => a.Id == id && a.CurrentState > 0,
                q => q.Include(a => a.TbCollectionImages),
                q => q.Include(a => a.TbCollectionFabrics),
                q => q.Include(a => a.TbCollectionItems)
                    .ThenInclude(ci => ci.Item), // ✅ nested include
                q => q.Include(a => a.TbChanges)
                    .ThenInclude(c => c.TbChangeImages) // ✅ لو محتاج
            );

            var collection = collections.FirstOrDefault();
            return collection == null ? null : Mapper.Map<TbCollections, CollectionDto>(collection);
        }
        

        public bool AddCollectionWithImagesAndFabrics(CollectionDto collectionDto)
        {

            var tbCollections = Mapper.Map<CollectionDto, TbCollections>(collectionDto);
    
            var createdBy = userService.GetLoggedInUser();
            var now = DateTime.Now;

            tbCollections.Id = collectionDto.Id != Guid.Empty ? collectionDto.Id : Guid.NewGuid();
            tbCollections.CreatedBy = createdBy;
            tbCollections.CreatedDate = now;
            tbCollections.CurrentState = 1;

            foreach (var img in tbCollections.TbCollectionImages)
            {
                img.Id = Guid.NewGuid();
                img.CollectionId = tbCollections.Id;
                img.CreatedBy = createdBy;
                img.CreatedDate = now;
                img.CurrentState = 1;
               // _imageRepository.Add(img);
            }

            foreach (var fabric in tbCollections.TbCollectionFabrics)
            {
                fabric.Id = Guid.NewGuid();
                fabric.CollectionId = tbCollections.Id;
                fabric.CreatedBy = createdBy;
                fabric.CreatedDate = now;
                fabric.CurrentState = 1;
            }

            foreach (var item in tbCollections.TbCollectionItems)
            {
                item.CollectionId = tbCollections.Id;
                item.Id = Guid.NewGuid();
                item.CreatedBy = createdBy;
                item.CreatedDate = now;
                item.CurrentState = 1;
                item.CollectionId = tbCollections.Id; // ✅

            }
            
       //     Guid changeId = Guid.NewGuid();
            foreach (var change in tbCollections.TbChanges)
            {
                change.Id = change.Id;
                change.CreatedBy = createdBy;
                change.CreatedDate = now;
                change.CurrentState = 1;
                change.CollectionId = tbCollections.Id;

                if (change.TbChangeImages != null)
                {
                    foreach (var img in change.TbChangeImages)
                    {
                        img.Id = Guid.NewGuid();
                        img.TbChangesId = change.Id;
                        img.CreatedBy = createdBy;
                        img.CreatedDate = now;
                        img.CurrentState = 1;
                        img.ChangeId = change.Id;
                    }
                }
            }

            return repository.Add(tbCollections);
        }

        public bool UpdateCollectionWithImagesAndFabrics(CollectionDto collectionDto)
        {
            if (collectionDto.CollectionImages == null)
            {
                collectionDto.CollectionImages = new List<CollectionImagesDto>();
            }
            if (collectionDto.CollectionFabrics == null)
            {
                collectionDto.CollectionFabrics = new List<CollectionFabricsDto>();
            }
            if (collectionDto.CollectionItems == null)
            {
                collectionDto.CollectionItems = new List<CollectionItemsDto>();
            }
            if (string.IsNullOrWhiteSpace(collectionDto.MainImage) && collectionDto.CollectionImages.Count > 0)
            {
                collectionDto.MainImage = collectionDto.CollectionImages[0].ImageUrl;
            }

            var tbCollections = Mapper.Map<CollectionDto, TbCollections>(collectionDto);
            tbCollections.UpdatedBy = userService.GetLoggedInUser();
            tbCollections.UpdatedDate = DateTime.Now;

            // Handle images update
            var existingImages = _imageRepository.GetList(i => i.CollectionId == collectionDto.Id).Result;
            foreach (var oldImg in existingImages)
            {
                _imageRepository.Delete(oldImg.Id);
            }

            foreach (var newImg in tbCollections.TbCollectionImages)
            {
                newImg.CollectionId = tbCollections.Id;
                newImg.CreatedBy = userService.GetLoggedInUser();
                newImg.CreatedDate = DateTime.Now;
                newImg.CurrentState = 1;
                newImg.Id = Guid.NewGuid();
                _imageRepository.Add(newImg);
            }

            // Handle fabrics update
            var existingFabrics = _fabricRepository.GetList(f => f.CollectionId == collectionDto.Id).Result;
            foreach (var oldFabric in existingFabrics)
            {
                _fabricRepository.Delete(oldFabric.Id);
            }

            foreach (var newFabric in tbCollections.TbCollectionFabrics)
            {
                newFabric.CollectionId = tbCollections.Id;
                newFabric.CreatedBy = userService.GetLoggedInUser();
                newFabric.CreatedDate = DateTime.Now;
                newFabric.CurrentState = 1;
                newFabric.Id = Guid.NewGuid();
                _fabricRepository.Add(newFabric);
            }
            
            // Handle items update
            var existingItem = _itemRepository.GetList(i => i.CollectionId == collectionDto.Id).Result;
            foreach (var oldItem in existingItem)
            {
                _itemRepository.Delete(oldItem.Id);
            }

            foreach (var newItem in tbCollections.TbCollectionItems)
            {
                newItem.CollectionId = tbCollections.Id;
                newItem.CreatedBy = userService.GetLoggedInUser();
                newItem.CreatedDate = DateTime.Now;
                newItem.CurrentState = 1;
                newItem.Id = Guid.NewGuid();
                _itemRepository.Add(newItem);
            }

            return repository.Update(tbCollections);
        }
    }
}
