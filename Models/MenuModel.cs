using System.ComponentModel.DataAnnotations;

namespace RestaurantBestelApp.Models
{
    public class MenuModel
    {
        [Key]
        public string? Dish { get; set; }
        public string? Type { get; set; }
        public string Info { get; set; } = null!;
        public double Price { get; set; }
    }
}
