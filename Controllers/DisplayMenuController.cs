using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantBestelApp.Models;
using RestaurantBestelApp.Database;

namespace RestaurantBestelApp.Controllers
{
    public class DisplayMenuController : Controller
    {
        private readonly AppDbContext _context;

        public DisplayMenuController(AppDbContext context)
        {
            this._context = context;
        }

        public IActionResult Index()
        {
            var customerName = Request.Cookies["CustomerName"];
            var tableNumber = Request.Cookies["TableNumber"];
            var employee = Request.Cookies["Employee"];

            ViewData["Customer"] = customerName?.ToUpper();
            ViewData["TableNumber"] = tableNumber;
            ViewData["Employee"] = employee;

            return View();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuModel>>> GetMenuItems()
        {
            var menu = await _context.Dbmenu
                                       .Select(u => new MenuModel
                                       {
                                           Dish = u.Dish,
                                           Type = u.Type,
                                           Info = u.Info,
                                           Price = u.Price,
                                       })
                                       .ToListAsync();
            return Ok(menu);
        }
    }
}
