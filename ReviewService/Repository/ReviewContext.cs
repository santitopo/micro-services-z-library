using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class ReviewContext : DbContext
    {
        public DbSet<Review> Reviews { get; set; }

        public ReviewContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Review>().HasKey(a => new { a.MemberId, a.BookId });
        }

    }
}
