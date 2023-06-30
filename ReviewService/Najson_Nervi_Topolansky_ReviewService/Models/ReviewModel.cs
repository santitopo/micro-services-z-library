using System;
namespace WebAPI.Models
{
    public class ReviewModel
    {
        public string isbn { get; set; }
        public int score { get; set; }
        public string text { get; set; }
    }
}
