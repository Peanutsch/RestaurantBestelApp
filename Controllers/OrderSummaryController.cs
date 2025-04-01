using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
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

        /// <summary>
        /// Displays the login page view.
        /// </summary>
        /// <returns>The login view (Index view).</returns>
        //[HttpGet]
        public IActionResult Index()
        {
            return View();  // Returns the login page view
        }

        [HttpPost]
        public void OrderSummary()
        {

        }
    }
}
