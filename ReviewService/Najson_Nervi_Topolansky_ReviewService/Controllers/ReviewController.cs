using System;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using ServicesInterface;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Models;
using System.Linq;
using Domain;

namespace WebAPI.Controllers
{
    [Route("/reviews")]
    [ApiController]
    public class ReviewController : Controller
    {
        private readonly IReviewService reviewLogic;

        public ReviewController(IReviewService reviewLogic)
        {
            this.reviewLogic = reviewLogic;
        }

        [HttpGet("/reviews/{isbn}")]
        public IActionResult GetReviews([FromRoute] string isbn)
        {
            try
            {
                return Ok(reviewLogic.GetReviewsByBook(isbn));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        public IActionResult GetReviewByBookAndMember([FromQuery] int book_id, [FromQuery] int member_id)
        {
            try
            {
                Review review = reviewLogic.GetReviewByBookMember(book_id, member_id);

                if(review == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(review);
                }
                
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public IActionResult PostReview([FromBody] ReviewModel reviewModel)
        {
            string bearerToken = HttpContext.Request.Headers["Authorization"];
            string token = bearerToken.Replace("Bearer ", "");

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadJwtToken(token);
            var tokenS = jsonToken.Claims;

            var organization = tokenS.First(claim => claim.Type == "organizationId").Value;
            var member = tokenS.First(claim => claim.Type == "memberId").Value;

            int organizationId = Int32.Parse(organization);
            int memberId = Int32.Parse(member);

            var newReview = new Review(reviewModel.isbn, -1, reviewModel.score, reviewModel.text, memberId);

            try
            {
                return Ok(reviewLogic.AddReview(newReview, organizationId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("/reviews/{isbn}")]
        public IActionResult DeleteReview([FromRoute] string isbn)
        {
            string bearerToken = HttpContext.Request.Headers["Authorization"];
            string token = bearerToken.Replace("Bearer ", "");

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadJwtToken(token);
            var tokenS = jsonToken.Claims;

            var member = tokenS.First(claim => claim.Type == "memberId").Value;
            int memberId = Int32.Parse(member);

            try
            {
                reviewLogic.DeleteReview(isbn, memberId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
