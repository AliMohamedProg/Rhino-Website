using System.Collections;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Bl.Contracts;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Areas.Admin.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CollectionController : ControllerBase
    {
        ICollections _collectionService;
         IChanges _changesService;
        public CollectionController(ICollections collectionService,  IChanges changesService)
        {
            _collectionService = collectionService;
            _changesService = changesService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public async Task<List<CollectionDto>> Get()
        {
            var collections = await _collectionService.GetAllCollectionsWithImagesAndFabrics();
            return collections;
        }
        
        [HttpGet("get-collection/{collectionId}")]
        public CollectionDto GetCollectionWithChanges(Guid collectionId ,[FromQuery] Guid changeId)
        {
            var collections = _changesService.GetCollectionWithChange(collectionId, changeId);
            return collections;
        }
        
        [HttpGet("collection-details/{collectionId}")]
        public async Task<CollectionDto> GetDetials(Guid collectionId)
        {
            var collection = await _collectionService.GetCollectionWithImagesAndFabrics(collectionId);
            return collection;
        }
        
        [HttpPost("add-collection")]
        public async Task<object> Add(CollectionDto collectionDto)
        {
            try
            {
                var mainImage = collectionDto.MainImage;
                if (string.IsNullOrWhiteSpace(mainImage) && collectionDto.CollectionImages != null && collectionDto.CollectionImages.Count > 0)
                {
                    mainImage = collectionDto.CollectionImages[0].ImageUrl;
                }

                if (collectionDto.DiscountAmount.GetValueOrDefault() > 0)
                {
                    collectionDto.OldPrice = collectionDto.Price;
                    collectionDto.Price = collectionDto.Price - (collectionDto.Price * ((decimal)collectionDto.DiscountAmount.Value / 100m));
                }
                else
                {
                    collectionDto.OldPrice = collectionDto.Price;
                }
                var newId = Guid.NewGuid(); // ← أولاً

                var collection = new CollectionDto()
                {
                    CurrentState = 1,
                    Id = newId,
                    Name = collectionDto.Name,
                    Description = collectionDto.Description,
                    Colors = collectionDto.Colors,
                    DiscountAmount = collectionDto.DiscountAmount,
                    MainImage = mainImage,
                    Price = collectionDto.Price, 
                    OldPrice = collectionDto.OldPrice,
                    StockNumber = collectionDto.StockNumber,
                    CategoryId = collectionDto.CategoryId,
                    StyleId = collectionDto.StyleId, 
                    CollectionImages = collectionDto.CollectionImages,
                    CollectionFabrics =  collectionDto.CollectionFabrics,
                    Dimensions =  collectionDto.Dimensions ,
                    SKU =  collectionDto.SKU,
                    Material = collectionDto.Material,
                    CollectionItems = collectionDto.CollectionItems?.Select(i => {
                        i.CollectionId = newId; // ✅
                        return i;
                    }).ToList(),
                    Changes = collectionDto.Changes?.Select(c => 
                    {
                        c.CollectionId = newId;
                        var changeId = Guid.NewGuid(); // ← تأكد إن فيه Id
                        c.Id = changeId;
    
                        c.ChangeImages = c.ChangeImages?.Select(img => 
                        {
                            img.ChangeId = changeId; // ← ربط الـ image بالـ change
                            img.Changes = null; // ← prevent duplicate TbChanges tracking
                            return img;
                        }).ToList();
                        return c;
                    }).ToList() ?? new List<ChangeDto>(),
                    ItemsCount =  collectionDto.CollectionItems.Count
                };
                _collectionService.AddCollectionWithImagesAndFabrics(collection);
                return true;
            }
            catch (Exception ex)
            {
                // بدل return false
                var innerMsg = ex.InnerException?.InnerException?.Message 
                               ?? ex.InnerException?.Message 
                               ?? ex.Message;
    
                return StatusCode(500, new { error = innerMsg }); // هتشوف الـ error في الـ response
            }
        }
        
        [HttpPost("edit-collection/{collectionId}")]
        public async Task<bool> Edit(Guid collectionId)
        {
            try
            {
                var collectionDto = _collectionService.GetById(collectionId);
                var mainImage = collectionDto.MainImage;
                if (string.IsNullOrWhiteSpace(mainImage) && collectionDto.CollectionImages != null && collectionDto.CollectionImages.Count > 0)
                {
                    mainImage = collectionDto.CollectionImages[0].ImageUrl;
                }

                if (collectionDto.DiscountAmount.GetValueOrDefault() > 0)
                {
                    collectionDto.OldPrice = collectionDto.Price;
                    collectionDto.Price = collectionDto.Price - (collectionDto.Price * ((decimal)collectionDto.DiscountAmount.Value / 100m));
                }
                else
                {
                    collectionDto.OldPrice = collectionDto.Price;
                }

                var collection = new CollectionDto()
                {
                    CurrentState = 1,
                    Id = collectionDto.Id,
                    Name = collectionDto.Name,
                    Description = collectionDto.Description,
                    Colors = collectionDto.Colors,
                    DiscountAmount = collectionDto.DiscountAmount,
                    MainImage = mainImage,
                    Price = collectionDto.Price, 
                    OldPrice = collectionDto.OldPrice,
                    StockNumber = collectionDto.StockNumber,
                    CategoryId = collectionDto.CategoryId,
                    StyleId = collectionDto.StyleId, 
                    CollectionImages = collectionDto.CollectionImages,
                    CollectionFabrics =  collectionDto.CollectionFabrics,
                    Dimensions =  collectionDto.Dimensions ,
                    SKU =  collectionDto.SKU,
                    Material = collectionDto.Material,
                    CollectionItems = collectionDto.CollectionItems?.Select(i => {
                        i.CollectionId = collectionDto.Id; // ✅
                        return i;
                    }).ToList(),
                    Changes = collectionDto.Changes?.Select(c => 
                    {
                        c.CollectionId = collectionDto.Id;
                        var changeId = c.Id == Guid.Empty ? Guid.NewGuid() : c.Id;
                        c.Id = changeId;
                        c.ChangeImages = c.ChangeImages?.Select(img =>
                        {
                            img.ChangeId = changeId;
                            img.Changes = null; // ← prevent duplicate TbChanges tracking
                            return img;
                        }).ToList();
                        return c;
                    }).ToList() ?? new List<ChangeDto>(),
                    ItemsCount =  collectionDto.CollectionItems.Count
                };

                _collectionService.UpdateCollectionWithImagesAndFabrics(collection);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        
        [HttpPost("delete-collection/{collectionId}")]
        public async Task<IActionResult> Delete([FromRoute] Guid collectionId)
        {
            try
            {
                var result = _collectionService.MarkAsDeleted(collectionId, 0); // Soft delete
                if (result)
                    return Ok(new { success = true, message = "Item deleted successfully" });

                return NotFound(new { success = false, message = "Item not found in database" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
        
        [HttpPost("delete-all-collection")]
        public async Task<IActionResult> DeleteAll()
        {
            try
            {
                var result = _collectionService.DeleteAll();
                if (result)
                    return Ok(new { success = true, message = "Items deleted successfully" });

                return NotFound(new { success = false, message = "Items not found in database" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
    }
}
