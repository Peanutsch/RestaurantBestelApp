using System.ComponentModel.DataAnnotations;

namespace RestaurantBestelApp.Models
{
    public class OrderModel
    {
        [Key]
        public DateTime Date { get; set; }
        public DateTime Time { get; set; }
        public int TableNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? Order { get; set; }

        public string? Status { get; set;  }
    }
}
