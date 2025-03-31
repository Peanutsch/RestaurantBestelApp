// Wait for the DOM to fully load before executing the script
document.addEventListener("DOMContentLoaded", function ()
{
    addAuthHeaderToRequest('/api/users'); // Fetch users using the new API
});

// Function to add the JWT token to the request header and fetch user data
function addAuthHeaderToRequest(url)
{
    const token = getCookie('AuthToken'); // Retrieve the JWT token from cookies

    if (!token)
    {
        console.warn("[authRequest.js] No JWT token found in cookies...");
        return;
    }

    // Send a GET request to the API with the JWT token in the Authorization header
    fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok')) // Handle HTTP response
        .then(displayUsers) // Pass retrieved users data to displayUsers function
        .catch(error => console.error("Request failed:", error)); // Log errors if the request fails
}

// Function to retrieve a cookie by name
function getCookie(name)
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2)
    {
        return parts.pop().split(';').shift();
    }

    console.warn("[authRequest.js] getCookie > No cookie found");
    return null;
}