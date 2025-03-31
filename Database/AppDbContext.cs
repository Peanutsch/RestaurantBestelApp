using Microsoft.EntityFrameworkCore;
using RestaurantBestelApp.Models;

namespace RestaurantBestelApp.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<UserLoginModel> Users { get; set; } // Gebruik UserLoginModel voor database werknemers
    }
}
