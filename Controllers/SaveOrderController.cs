using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using RestaurantBestelApp.Database;
using RestaurantBestelApp.Models;
using Microsoft.AspNetCore.Authorization;

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

        //testje
        public async Task<ActionResult<IEnumerable>OrderModel>>>CreateModel()
        {

        }

        [HttpPost]
        //[IgnoreAntiforgeryToken]
        public async Task<IActionResult> SaveOrder([FromBody] OrderModel confirmedOrder)
        //public IActionResult SaveOrder(OrderModel confirmedOrder)
        {
            Debug.WriteLine("\n[NOTIFICATION] Running SaveOrderController/SaveOrder\n");

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                Debug.WriteLine($"\n[NOTIFICATION] SaveOrder: ModelState not valid");

                return BadRequest(new { success = false, message = "Validation failed", errors });
            }

            //await AddOrderToDatabase(confirmedOrder);
            await AddOrderToDatabase(confirmedOrder);
            Debug.WriteLine($"\n[NOTIFICATION] Calling AddOrderToDataBase, param: {confirmedOrder}\n");

            return Ok(new { success = true, message = "Order succesful saved" });

        }

        public async Task AddOrderToDatabase(OrderModel confirmedOrder)
        //public void AddOrderToDatabase(OrderModel confirmedOrder)
        {
            Debug.WriteLine($"\n[NOTIFICATION] Running SaveOrderController/AddOrderToDatabase, param: {confirmedOrder}");
            Debug.WriteLine("[NOTIFICATION] _context.DbOrder.Add(confirmedOrder);");
            Debug.WriteLine("[NOTIFICATION] await _context.SaveChangesAsync();\n");
            //_context.DbOrder.Add(confirmedOrder);
            //await _context.SaveChangesAsync();
        }
    }
}
