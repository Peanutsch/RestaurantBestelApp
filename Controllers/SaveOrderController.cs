using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using RestaurantBestelApp.Database;
using RestaurantBestelApp.Models;
using Microsoft.AspNetCore.Authorization;
using System.Collections;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace RestaurantBestelApp.Controllers
{
    public class SaveOrderController : Controller
    {
        private readonly AppDbContext _context;
        public SaveOrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetLastOrderId()
        {
            var lastOrderId = await _context.DbOrders
                .OrderByDescending(o => o.OrderId)
                .Select(o => (int?)o.OrderId) // Zorgt ervoor dat het een nullable int is
                .FirstOrDefaultAsync();

            int newOrderId = (lastOrderId.HasValue) ? lastOrderId.Value + 1 : 1;

            return Ok(new { orderId = newOrderId });
        }


        [HttpPost]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> SaveOrder([FromBody] OrderModel confirmedOrder)
        {
            Debug.WriteLine("\n[NOTIFICATION] Running SaveOrderController/SaveOrder\n");

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                Debug.WriteLine($"\n[NOTIFICATION] SaveOrder: ModelState not valid");
                Debug.WriteLine($"[ERROR] ModelState errors: {string.Join(", ", errors)}");

                return BadRequest(new { success = false, message = "Validation failed", errors });
            }

            await AddOrderToDatabase(confirmedOrder);

            return Ok(new { success = true, message = "Order succesful saved" });
        }

        public async Task AddOrderToDatabase(OrderModel confirmedOrder)
        {
            Debug.WriteLine($"\n[NOTIFICATION] Running SaveOrderController/AddOrderToDatabase\n{JsonConvert.SerializeObject(confirmedOrder)}\n");
            _context.DbOrders.Add(confirmedOrder);
            await _context.SaveChangesAsync();
        }
    }
}
