using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace RestaurantBestelApp.Models
{
    [Keyless]
    public class OrderModel
    {
        public required string Date { get; set; }
        public required string Time { get; set; }
        public string? TableNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? Order { get; set; }
        public string? Status { get; set;  }
    }
}
