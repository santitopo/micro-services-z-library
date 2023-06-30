using System;
using System.Collections.Generic;
using System.Linq;
using Domain;
using PersistenceInterface;
using ServicesInterface;

namespace Services
{
    public class ReviewService : IReviewService
    {
        private readonly IRepository<Review> reviewRepository;
        private readonly BookService bookService;
        private readonly MemberService memberService;

        public ReviewService(IRepository<Review> reviewRepository)
        {
            this.reviewRepository = reviewRepository;
            this.memberService = new MemberService();
            this.bookService = new BookService();
        }


        public IEnumerable<ReviewMember> GetReviewsByBook(string isbn)
        {
            string[] param = { };
            var reviews =  reviewRepository.GetAll(param).Where(x => x.Isbn == isbn).ToList();

            var reviewsWithMember = new List<ReviewMember>();

            foreach(Review review in reviews)
            {
                Member m = memberService.GetMember(review.MemberId);

                ReviewMember rm = new ReviewMember(review.Isbn, review.BookId, review.Score, review.Text, m.Name, m.Lastname, m.Email);
                reviewsWithMember.Add(rm);
            }

            return reviewsWithMember;
        }

        public Review GetReviewByBookMember(int bookId, int memberId)
        {
            string[] param = { };
            var review = reviewRepository.GetAll(param).Where(x => x.BookId == bookId && x.MemberId == memberId).FirstOrDefault();

            return review;
        }

        public Review AddReview(Review review, int organizationId)
        {
            // Get book
            int bookId = bookService.GetBookId(review.Isbn, organizationId);

            if (bookId == 0)
            {
                throw new ApplicationException("The book doesn't exists.");
            }

            // Add Book
            Review newReview = new Review(review.Isbn, bookId, review.Score, review.Text, review.MemberId);
            reviewRepository.Create(newReview);
            reviewRepository.Save();
            return newReview;

        }

        public void DeleteReview(string isbn, int memberId)
        {
            string[] param = { };
            Review reviewToDelete = reviewRepository.GetAll(param).Where(x => x.Isbn == isbn && x.MemberId == memberId).FirstOrDefault();
            reviewRepository.Delete(reviewToDelete);
            reviewRepository.Save();
        }

    }
}
