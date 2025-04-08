using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantBestelApp.Database;
using RestaurantBestelApp.Models;

namespace RestaurantBestelApp.Controllers
{
    public class OrderHistoryController : Controller
    {
        private readonly AppDbContext _context;

        public OrderHistoryController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderHistory()
        {
            var orderHistory = await _context.DbOrders
                .Select(u => new OrderModel
                {
                    OrderId = u.OrderId,
                    Date = u.Date,
                    Time = u.Time,
                    TableNumber = u.TableNumber,
                    CustomerName = u.CustomerName,
                    Order = u.Order,
                    Status = u.Status,
                    Price = u.Price
                })
                .ToListAsync();

            return Ok(orderHistory);
        }
    }
}
