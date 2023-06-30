using System;
namespace Domain
{
    public class Review
    {
        public string Isbn { get; set; }
        public int BookId { get; set; }
        public int Score { get; set; }
        public string Text { get; set; }
        public int MemberId { get; set; }

        public Review()
        {
        }

        public Review(string isbn, int bookId, int score, string text, int memberId)
        {
            Isbn = isbn;
            BookId = bookId;
            Score = score;
            Text = text;
            MemberId = memberId;
        }

        public Review(int bookId, int score, string text, int memberId)
        {
            BookId = bookId;
            Score = score;
            Text = text;
            MemberId = memberId;
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
            {
                return false;
            }
            if (!(obj is Review))
            {
                return false;
            }

            return BookId == ((Review)obj).BookId && MemberId == ((Review)obj).MemberId;
        }

    }
}
