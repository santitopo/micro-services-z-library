using System;
using System.Collections.Generic;
using Domain;
using PersistenceInterface;

namespace RepositoryInterface
{
    public interface IReviewRepository : IRepository<Review>
    {
        Review AddReview(Review review);
        void DeleteReview(int bookId, int memberId);
        Review GetReviewByBookAndMemberIds(int bookId, int memberId);
        IEnumerable<Review> getBookReviewsOrderedByDate(int bookId);
    }
}
