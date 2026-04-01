using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ReviewsController : ControllerBase
    {
        IReview _reviewService;
        public ReviewsController(IReview reviewService)
        {
            _reviewService = reviewService;
        }
        [HttpPost("delete-review")]
        public ActionResult DeleteReview([FromBody]Guid reviewId)
        {
            var review = _reviewService.GetById(reviewId);

            if (review == null)
            {
                return NotFound("Review not found.");
            }
            _reviewService.MarkAsDeleted(reviewId);

            return Ok("Review Deleted successfully!");
        }
        [HttpGet("get-reviews")]
        public ActionResult<List<ReviewDto>> GetReviews()
        {
            var reviews = _reviewService.GetAll();
            return Ok(reviews);
        }
    }
}
