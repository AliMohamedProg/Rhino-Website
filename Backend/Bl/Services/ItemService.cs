using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using BusinessLayer.Services;
using DAL.Contracts;
using Domains;

namespace Bl.Services
{
    public class ItemService : BaseService<TbItem, ItemDto>, IItem
    {
        private readonly ITableRepository<TbImage> _imageRepository;
        private readonly ITableRepository<TbFabrics> _fabricRepository;

        public ItemService(ITableRepository<TbItem> _repository, IMapper _Mapper, IUserService userService, 
            ITableRepository<TbImage> imageRepository, ITableRepository<TbFabrics> fabricRepository)
            : base(_repository, _Mapper, userService)
        {
            _imageRepository = imageRepository;
            _fabricRepository = fabricRepository;
        }

        public List<ItemDto> GetAllItemsWithImagesAndFabrics()
        {
            var items = repository.GetList<TbItem>(
                filter: a => a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false,
                a => a.TbImages,
                a => a.TbFabrics
                
            ).GetAwaiter().GetResult();
            return Mapper.Map<List<TbItem>, List<ItemDto>>(items);
        }

        public ItemDto? GetItemWithImagesAndFabrics(Guid id)
        {
            var items = repository.GetList<TbItem>(
                filter: a => a.Id == id && a.CurrentState > 0,
                selector: null,
                orderBy: null,
                isDescending: false,
                a => a.TbImages,
                a => a.TbFabrics
            ).GetAwaiter().GetResult();

            var item = items.FirstOrDefault();
            return item == null ? null : Mapper.Map<TbItem, ItemDto>(item);
        }

        public bool AddItemWithImagesAndFabrics(ItemDto itemDto)
        {
            
                var tbItem = Mapper.Map<ItemDto, TbItem>(itemDto);
                tbItem.CreatedBy = userService.GetLoggedInUser();
                tbItem.CreatedDate = DateTime.Now;
                tbItem.CurrentState = 1;

                var createdBy = userService.GetLoggedInUser();
                var now = DateTime.Now;

                foreach (var img in tbItem.TbImages)
                {
                    img.Id = Guid.NewGuid();
                    img.CreatedBy = createdBy;
                    img.CreatedDate = now;
                    img.CurrentState = 1;
                }

                foreach (var fabric in tbItem.TbFabrics)
                {
                    fabric.Id = Guid.NewGuid();
                    fabric.CreatedBy = createdBy;
                    fabric.CreatedDate = now;
                    fabric.CurrentState = 1;
                }

                return repository.Add(tbItem);
            
        }

        public bool UpdateItemWithImagesAndFabrics(ItemDto itemDto)
        {
            if (itemDto.Images == null)
            {
                itemDto.Images = new List<ImageDto>();
            }
            if (itemDto.Fabrics == null)
            {
                itemDto.Fabrics = new List<FabricsDto>();
            }
            if (string.IsNullOrWhiteSpace(itemDto.MainImage) && itemDto.Images.Count > 0)
            {
                itemDto.MainImage = itemDto.Images[0].ImageUrl;
            }

            var tbItem = Mapper.Map<ItemDto, TbItem>(itemDto);
            tbItem.UpdatedBy = userService.GetLoggedInUser();
            tbItem.UpdatedDate = DateTime.Now;

            // Handle images update
            var existingImages = _imageRepository.GetList(i => i.ProductId == itemDto.Id).Result;
            foreach (var oldImg in existingImages)
            {
                _imageRepository.Delete(oldImg.Id);
            }

            foreach (var newImg in tbItem.TbImages)
            {
                newImg.ProductId = tbItem.Id;
                newImg.CreatedBy = userService.GetLoggedInUser();
                newImg.CreatedDate = DateTime.Now;
                newImg.CurrentState = 1;
                newImg.Id = Guid.NewGuid();
                _imageRepository.Add(newImg);
            }

            // Handle fabrics update
            var existingFabrics = _fabricRepository.GetList(f => f.ProductId == itemDto.Id).Result;
            foreach (var oldFabric in existingFabrics)
            {
                _fabricRepository.Delete(oldFabric.Id);
            }

            foreach (var newFabric in tbItem.TbFabrics)
            {
                newFabric.ProductId = tbItem.Id;
                newFabric.CreatedBy = userService.GetLoggedInUser();
                newFabric.CreatedDate = DateTime.Now;
                newFabric.CurrentState = 1;
                newFabric.Id = Guid.NewGuid();
                _fabricRepository.Add(newFabric);
            }

            return repository.Update(tbItem);
        }
    }
}
