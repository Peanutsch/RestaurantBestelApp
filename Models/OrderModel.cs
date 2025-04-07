using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace RestaurantBestelApp.Models
{
    public class OrderModel
    {
        [Key]
        public int OrderId { get; set; }
        public required string Date { get; set; }
        public required string Time { get; set; }
        public string? TableNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? Order { get; set; }
        public string? Status { get; set;  }
        public decimal? Price { get; set; }
    }
}
