using Serilog;

namespace RestaurantBestelApp.Services
{
    public class LogEventService
    {
        public void LogLogin(string currentUser, string userRole)
        {
            Log.Information
            (@$" [LOGIN] 
            [{userRole.ToUpper()}] {currentUser.ToUpper()} logged in
            ");
        }

        public void LogLogout(string currentUser, string userRole)
        {
            Log.Information
            (@$" [LOGOUT] 
            [{userRole.ToUpper()}] [{currentUser.ToUpper()}] logged out
            ");
        }
    }
}
