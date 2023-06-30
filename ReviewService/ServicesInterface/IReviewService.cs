using System.Collections.Generic;
using Domain;

namespace ServicesInterface
{
    public interface IReviewService
    {

        IEnumerable<ReviewMember> GetReviewsByBook(string isbn);

        Review GetReviewByBookMember(int bookId, int memberId);

        Review AddReview(Review review, int organizationId);

        void DeleteReview(string isbn, int memberId);

    }
}
