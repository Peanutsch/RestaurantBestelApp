using Microsoft.AspNetCore.Mvc;
using RestaurantBestelApp.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RestaurantBestelApp.Database;
using System.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Data;
using Newtonsoft.Json;
using RestaurantBestelApp.Services;
using Serilog;


public class LoginController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;
    private readonly LogEventService _logEventService;

    // Constructor to inject configuration and database context
    public LoginController(IConfiguration configuration, AppDbContext context, LogEventService logEventService)
    {
        _configuration = configuration;  // Access application settings (e.g., JWT secret, issuer, etc.)
        _context = context;  // Database context to interact with the Users table in the database
        _logEventService = logEventService;
    }

    /// <summary>
    /// Displays the login page view.
    /// </summary>
    /// <returns>The login view (Index view).</returns>
    [HttpGet]
    public IActionResult Index()
    {
        return View();  // Returns the login page view
    }

    /// <summary>
    /// Handles the login process by verifying user credentials and generating a JWT token.
    /// </summary>
    /// <param name="model">The login model containing the alias (username) and password provided by the user.</param>
    /// <returns>Redirects to a view or returns a JSON response with a token.</returns>
    [HttpPost]
    //[IgnoreAntiforgeryToken]  // Disables CSRF protection for this action
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        Debug.WriteLine("[NOTIFICATION] running Login/Login");

        try
        {
            var usersCount = await _context.Users.CountAsync();  // Controleer het aantal gebruikers in de database
            Debug.WriteLine($"User count: {usersCount}");

            if (ModelState.IsValid)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.AliasId == model.AliasId);
                if (user != null && BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
                {
                    var token = GenerateJwtToken(user);
                    Response.Cookies.Append("AuthToken", token, new CookieOptions
                    {
                        Secure = true,
                        Expires = DateTime.UtcNow.AddDays(1),
                        SameSite = SameSiteMode.Strict,
                        Path = "/"
                    });

                    var (currentUser, userRole) = GetUserFromToken(token);
                    _logEventService.LogLogin(currentUser.ToUpper(), userRole);
                    return Ok(new { token });
                }
            }
        }
        catch (Exception ex)
        {
            //Log.Error("An error occurred during login: {Message}", ex.Message);
            Debug.WriteLine("An error occurred during login: {Message}", ex.Message);
            return StatusCode(500, "Internal server error");
        }

        Debug.WriteLine("[ERROR] /Login/Login: Skipped Try-Catch");
        return View(model);
    }


    public static (string currentUser, string userRole) GetUserFromToken(string token)
    {
        var jsonToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
        var userRole = jsonToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value ?? "Unknown";
        var currentUser = jsonToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value ?? "Unknown";
        return (currentUser, userRole);
    }

    /// <summary>
    /// Generates a JWT (JSON Web Token) for the authenticated user.
    /// </summary>
    /// <param name="user">The authenticated user whose information will be included in the token.</param>
    /// <returns>A JWT token string.</returns>
    private string GenerateJwtToken(UserLoginModel user)
    {
        Debug.WriteLine("\n[NOTIFICATION] running Login/GenerateJwtToken\n");
        // Define the claims (user-specific information) to be included in the JWT token
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.AliasId),   // AliasId (username) as the subject of the token
            new Claim(ClaimTypes.Name, user.AliasId),               // Name claim: AliasId (username)
            new Claim("role", user.Admin ? "admin" : "user"),       // Role claim: "admin" if the user is an admin, otherwise "user"
        };

        // Create a symmetric security key based on the secret key from the appsettings.json
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);  // Signing credentials with HMAC-SHA256

        // Create the JWT token with claims, expiration date, and signing credentials
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],       // Issuer of the token (usually the API server)
            audience: _configuration["Jwt:Audience"],   // Intended audience for the token (client apps)
            claims: claims,                             // Include the user-specific claims (AliasId, role)
            expires: DateTime.Now.AddDays(1),           // Token expires in 1 day
            signingCredentials: creds                   // Sign the token using the credentials
        );

        // Convert the token to a string and return it
        return new JwtSecurityTokenHandler().WriteToken(token);
    }


    [HttpPost]
    [ValidateAntiForgeryToken]  // Add this for CSRF protection
    public IActionResult Logout()
    {
        Debug.WriteLine("[NOTIFICATION] Running LoginController/Logout");

        // Remove AuthToken cookie
        Response.Cookies.Delete("AuthToken");


        // Remove Antiforgery cookie (if applicable)
        Response.Cookies.Delete("__RequestVerificationToken");

        // Log Logout {userRole, currentUser}
        var token = Request.Cookies["AuthToken"];
        var handler = new JwtSecurityTokenHandler();
        var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

        var currentUser = jsonToken!.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
        var userRole = jsonToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value ?? "Unknown";
        _logEventService.LogLogout(currentUser!, userRole);

        Debug.WriteLine($"[{userRole.ToUpper()}] [{currentUser!.ToUpper()}] logged out...\n");

        return RedirectToAction("Index", "Login");  // Redirect to login page
    }

}
