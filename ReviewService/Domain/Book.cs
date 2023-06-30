using System;
namespace Domain
{
    public class Book
    {
        public string Isbn { get; set; }
        public int Id { get; set; }

        public Book()
        {
            
        }

        public Book(string isbn, int id)
        {
            Isbn = isbn;
            Id = id;
        }
    }
}
