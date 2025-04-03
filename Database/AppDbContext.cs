using Microsoft.EntityFrameworkCore;
using RestaurantBestelApp.Models;

namespace RestaurantBestelApp.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<UserLoginModel> Users { get; set; }
        public DbSet<MenuModel> Dbmenu { get; set; }
        public DbSet<OrderModel> DbOrders { get; set; }
    }
}
