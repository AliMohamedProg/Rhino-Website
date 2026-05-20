using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Bl;
using Bl.Contracts;
using Bl.DTOs;

namespace Apis.Areas.Admin.Controllers;

[Route("api/admin/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]

public class ChangesController : ControllerBase
{
    ICollections _collectionService;
    IChanges _changesService;
    public ChangesController(ICollections collectionService, IChanges changesService)
    {
        _collectionService = collectionService;
        _changesService = changesService;
    }
    // GET: api/<ItemsController>
    [HttpPost("add-change/{collectionId}")]
    public IActionResult AddCollectionChanges(Guid collectionId, [FromBody] ChangeDto changeDto)
    {
        var collection = _collectionService.GetById(collectionId);
        if (collection == null)
        {
            return NotFound(new
            {
                error = $"Collection '{collectionId}' was not found. Create the collection first or send a valid collectionId."
            });
        }

        var change = new ChangeDto()
        {
            ChangeName = changeDto.ChangeName ?? string.Empty,
            NewDescription = changeDto.NewDescription ?? string.Empty,
            NewName = changeDto.NewName ?? string.Empty,
            NewDimensions = changeDto.NewDimensions ?? string.Empty,
            NewSKU = changeDto.NewSKU ?? string.Empty,
            OverPrice = changeDto.OverPrice,
            CollectionId = collectionId,
            ChangeImages = changeDto.ChangeImages?.Select(img => new ChangeImagesDto
            {
                ImageUrl = img.ImageUrl,
                CurrentState = 1
            }).ToList() ?? new List<ChangeImagesDto>()
        };
        _changesService.Add(change);
        return Ok(true);
    }
    

}
