using System.ComponentModel.DataAnnotations;

namespace RestaurantBestelApp.Models
{
    public class UserLoginModel
    {
        [Key]
        public string AliasId { get; set; } = null!;

        public string Password { get; set; } = null!; // BCrypt hash
        public bool Admin { get; set; }
        public bool OnlineStatus { get; set; }
        public bool TheOne { get; set; }

        /// <summary>
        /// Hash het wachtwoord met BCrypt.
        /// </summary>
        public void SetPassword(string password)
        {
            Password = BCrypt.Net.BCrypt.HashPassword(password);
        }

        /// <summary>
        /// Controleer of het wachtwoord correct is.
        /// </summary>
        public bool VerifyPassword(string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, Password);  // Vergelijk met de gehashte versie
        }
    }
}