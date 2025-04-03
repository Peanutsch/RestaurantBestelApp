using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using RestaurantBestelApp.Database;
using RestaurantBestelApp.Models;
using Microsoft.AspNetCore.Authorization;
using System.Collections;
using Microsoft.EntityFrameworkCore;

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

            Debug.WriteLine($"Confirmed Order:");
            Debug.WriteLine($"OrderId: ${confirmedOrder.OrderId}");
            Debug.WriteLine($"Date: ${confirmedOrder.Date}");
            Debug.WriteLine($"Time: ${confirmedOrder.Time}");
            Debug.WriteLine($"Table: ${confirmedOrder.TableNumber}");
            Debug.WriteLine($"Name: ${confirmedOrder.CustomerName}");
            Debug.WriteLine($"Order: ${confirmedOrder.Order}");
            Debug.WriteLine($"Status: ${confirmedOrder.Status}");


            Debug.WriteLine($"\n[NOTIFICATION] Calling AddOrderToDataBase, param: {confirmedOrder}\n");



            return Ok(new { success = true, message = "Order succesful saved" });

        }

        public async Task AddOrderToDatabase(OrderModel confirmedOrder)
        {
            Debug.WriteLine($"\n[NOTIFICATION] Running SaveOrderController/AddOrderToDatabase, param: {confirmedOrder}");
            Debug.WriteLine("[RUNNING] _context.DbOrder.Add(confirmedOrder);");
            Debug.WriteLine("[RUNNING] await _context.SaveChangesAsync();\n");
            _context.DbOrders.Add(confirmedOrder);
            await _context.SaveChangesAsync();
        }
    }
}
