using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;

namespace RestaurantBestelApp.Controllers
{
    public class TableAssignmentController : Controller
    {
        public IActionResult Index()
        {
            var token = Request.Cookies["AuthToken"]; // Haal token uit de cookie

            if (!string.IsNullOrEmpty(token))
            {
                try
                {
                    var handler = new JwtSecurityTokenHandler();
                    var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

                    if (jsonToken != null)
                    {
                        ViewData["Employee"] = jsonToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value.ToUpper();
                        //ViewData["Role"] = jsonToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value.ToUpper();
                    }
                    else
                    {
                        Debug.WriteLine("[LoginController]\n Index > Invalid token format");
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"[LoginController]\n Index > Token error:\n{ex.Message}");
                }
            }
            else
            {
                Debug.WriteLine("[LoginController]\n Index > No token found in cookies");
            }
            return View();
        }

        [HttpPost]
        public IActionResult Submit(string Employee, string CustomerName, int TableNumber)
        {
            // Hier kan je de data opslaan in de database of verwerken
            Debug.WriteLine($"Medewerker: {Employee}, Klant: {CustomerName}, Tafel: {TableNumber}");

            return RedirectToAction("Index"); // Terug naar de tabel toewijzing pagina
        }
    }
}
