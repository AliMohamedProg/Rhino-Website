using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;
using Apis.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChangeController: ControllerBase
    {
        //ICollections _collectionService;
        IChanges _changesService;
        public ChangeController(/*ICollections collectionService,*/ IChanges changesService)
        {
            //_collectionService = collectionService;
            _changesService = changesService;
        }
        [HttpGet("get-changes/{collectionId}")]
        public ActionResult<List<ChangeDto>> GetCollectionChanges(Guid collectionId)
        {
            try
            {
                var changes = _changesService.GetAll().Where(c => c.CollectionId == collectionId).ToList();
                return Ok(changes);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
