using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantBestelApp.Database;
using RestaurantBestelApp.Models;

namespace RestaurantBestelApp.Controllers
{
    public class OrderSummaryController : Controller
    {
        private readonly AppDbContext _context;

        public OrderSummaryController(AppDbContext context)
        {
            this._context = context;
        }

        public IActionResult Index()
        {
            var CustomerName = Request.Cookies["CustomerName"];
            var OrderId = Request.Cookies["isOrderId"];
            var TableNumber = Request.Cookies["TableNumber"];

            ViewData["CustomerName"] = CustomerName?.ToUpper();
            ViewData["OrderId"] = OrderId;
            ViewData["TableNumber"] = TableNumber;

            return View();  // bereikbaar via: /OrderSummary
        }

        [HttpGet]
        public async Task<IActionResult> SummaryOrderItems()
        {
            var order = await _context.DbOrders
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

            return Ok(order); // bereikbaar via: /OrderSummary/SummaryOrderItems
        }
    }
}
