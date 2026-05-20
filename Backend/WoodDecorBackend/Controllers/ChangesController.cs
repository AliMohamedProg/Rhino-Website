using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollectionsController : ControllerBase
    {
        ICollections _collectionService;
        IChanges _changesService;
        public CollectionsController(ICollections collectionService,  IChanges changesService)
        {
            _collectionService = collectionService;
            _changesService = changesService;
        }
        // GET: api/<ItemsController>
        [HttpGet]
        public List<CollectionDto> Get()
        {
            var collections = _collectionService.GetAllCollectionWithImagesAndFabrics();
            return collections;
        }
        [HttpGet("collection-details/{collectionId}")]
        public CollectionDto GetDetials(Guid collectionId)
        {
            var collection = _collectionService.GetCollectionWithImagesAndFabrics(collectionId);
            return collection;
        }
        
        [HttpGet("collection-changes/{collectionId}")]
        public List<ChangeDto> GetCollectionChanges(Guid collectionId)
        {
            var changes = _changesService.GetAll().Where(c => c.CollectionId == collectionId).ToList();
            return changes;
        }

    }
}
