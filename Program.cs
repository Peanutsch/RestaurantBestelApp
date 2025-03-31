using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RestaurantBestelApp.Database;
using RestaurantBestelApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Diagnostics;
using Serilog;
using Microsoft.Extensions.Logging;
using Serilog.Events;
using Microsoft.AspNetCore.Authentication.Cookies;
/*
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using RestaurantBestelApp.Database;
using RestaurantBestelApp.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using RestaurantBestelApp.Controllers;
*/

namespace RestaurantBestelApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Voeg AppDbContext toe
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql
                (builder.Configuration.GetConnectionString("DefaultConnection"),
                 new MySqlServerVersion(new Version(8, 0, 36))));  // Ensure to use the correct MySQL version

            builder.Services.AddAntiforgery(options => {
                options.HeaderName = "RequestVerificationToken"; // Match met fetch header
            });

            builder.Services.AddScoped<LogEventService>();
            builder.Services.AddScoped<LoginController>();

            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.LoginPath = "/Login/Index";
                    options.AccessDeniedPath = "/Login/Index";
                });

            #region [JWT Authentication Config]
            // JWT Authentication configuration
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],  // Set your Issuer from appsettings.json
                        ValidAudience = builder.Configuration["Jwt:Audience"],  // Set your Audience from appsettings.json
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!))  // Secret key from appsettings.json
                    };
                });
            #endregion [JWT Authentication Config]

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthorization();

            app.MapStaticAssets();
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Login}/{action=Index}/{id?}")
                .WithStaticAssets();

            app.Run();
        }
    }
}
