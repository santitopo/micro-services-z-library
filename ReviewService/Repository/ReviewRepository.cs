using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using Domain;
using PersistenceInterface;
using RepositoryInterface;
using Persistence;
using System.Collections.Generic;

namespace Repository
{
    public class ReviewRepository : Repository<Review>, IReviewRepository
    {
        private readonly DbSet<Review> DbSet;
        private readonly DbContext context;

        public ReviewRepository(DbContext context) : base(context)
        {
            this.DbSet = context.Set<Review>();
            this.context = context;
        }

        public Review AddReview(Review review)
        {
            throw new NotImplementedException();
        }

        public void DeleteReview(int bookId, int memberId)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Review> getBookReviewsOrderedByDate(int bookId)
        {
            throw new NotImplementedException();
        }

        public Review GetReviewByBookAndMemberIds(int bookId, int memberId)
        {
            throw new NotImplementedException();
        }

        IEnumerable<Review> IReviewRepository.getBookReviewsOrderedByDate(int bookId)
        {
            throw new NotImplementedException();
        }
    }
}
