using System;
namespace Domain
{
    public class ReviewMember
    {
        public string Isbn { get; set; }
        public int BookId { get; set; }
        public int Score { get; set; }
        public string Text { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }


        public ReviewMember()
        {
        }

        public ReviewMember(string isbn, int bookId, int score, string text, string name, string lastname, string email)
        {
            Isbn = isbn;
            BookId = bookId;
            Score = score;
            Text = text;
            Name = name;
            Lastname = lastname;
            Email = email;
        }
    }
}
