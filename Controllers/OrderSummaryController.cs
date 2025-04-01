using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using RestaurantBestelApp.Database;
using RestaurantBestelApp.Models;

namespace RestaurantBestelApp.Controllers

{
    public class OrderSummaryController : Controller
    {
        private readonly AppDbContext _appDbContext;

        public OrderSummaryController(AppDbContext appDbContext)
        {
            this._appDbContext = appDbContext;
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

        [HttpGet]
        public void OrderSummary()
        {
            var Orderdate = DateTime.Now.ToString("dd-MM-yyyy");
            var Ordertime = DateTime.Now.ToString("HH:mm:ss");
            var Orderstatus = string.Empty;
        }
    }
}
