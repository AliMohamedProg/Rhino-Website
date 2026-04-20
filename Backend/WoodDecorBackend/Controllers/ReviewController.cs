using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Apis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        IReview _reviewService;
        IUserService _userService;
        IItem _itemService;
        public ReviewController(IReview reviewService, IUserService userService, IItem itemService)
        {
            _reviewService = reviewService;
            _userService = userService;
            _itemService = itemService;
        }
        [HttpPost("add-review")]
        public ActionResult AddReview(ReviewDto reviewDto)
        {
            Guid userId = _userService.GetLoggedInUser();
            var item = _itemService.GetById(reviewDto.ProductId);
            var user = _userService.GetUserByIdAsync(userId.ToString());
            // Here you would typically add the review to your database
            var review = new ReviewDto
            {
                Id = Guid.NewGuid(),
                Review = reviewDto.Review,
                Rating = reviewDto.Rating,
                UserId = userId,
                ProductId = reviewDto.ProductId,
                ProductNameAr = item.NameAr,
                ProductNameEn = item.NameEn,
                UserEmail = user.Result.Email,
                CurrentState = 1
            };
            _reviewService.Add(review);
            // For demonstration purposes, we'll just return a success message
            return Ok("Review added successfully!");
        }
        [HttpGet("get-reviews")]
        public ActionResult<List<ReviewDto>> GetReviews([FromQuery] Guid productId)
        {
            var reviews = _reviewService
                .GetAll()
                .Where(r => r.CurrentState == 1 && r.ProductId == productId)
                .ToList();

            return Ok(reviews);
        }
        [HttpGet("get-average-reviews")]
        public ActionResult<double> GetAverageReviews([FromQuery] Guid productId)
        {
            var reviews = _reviewService
                .GetAll()
                .Where(r => r.CurrentState == 1 && r.ProductId == productId)
                .ToList();

            if (!reviews.Any())
                return Ok(0);

            var average = reviews.Average(r => r.Rating);

            return Ok(Math.Round(average, 1));
        }
        [HttpGet("get-reviews-count")]
        public ActionResult<int> GetReviewsCount([FromQuery] Guid productId)
        {
            var reviewsCount = _reviewService
                .GetAll().Count(r => r.CurrentState == 1 && r.ProductId == productId);

            return Ok(reviewsCount);
        }
    }
}
