document.addEventListener("DOMContentLoaded", function ()
{
    // Function to store the JWT token in a cookie after a successful login
    function handleLogin(response)
    {
        if (response.token)
        {
            // Store the token in an HttpOnly cookie. The cookie will be valid for 24 hours (86400000 ms)
            document.cookie = `AuthToken=${response.token}; Secure; SameSite=Strict; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/`;
        } else
        {
            console.warn("[auth.js]\n handleLogin > No token received at login...");
        }
    }

    // Function to call the login API
    function login()
    {
        const alias = document.getElementById("alias").value; // Get the alias entered by the user
        const password = document.getElementById("password").value; // Get the password entered by the user

        // Send a POST request to the login API
        fetch('/Login/Login', {
            method: 'POST', // Use POST method for login
            headers: {
                'Content-Type': 'application/json' // Send data as JSON
            },
            body: JSON.stringify({ AliasId: alias, Password: password }), // Send alias and password in request body
            credentials: "include" // Ensure cookies are sent with the request
        })
            .then(response =>
            {
                if (!response.ok)
                {
                    throw new Error("[auth.js]\n login() Response > Login request failed"); // Handle non-OK responses
                }
                return response.json(); // Parse the JSON response
            })
            .then(responseData =>
            {
                if (responseData.token)
                {
                    Swal.fire({
                        toast: true,
                        //position: "top-end",
                        icon: "success",
                        title: "SUCCES!",
                        html: `Login succes!`,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() =>
                    {
                        handleLogin(responseData); // Token received, store it in the cookie
                        window.location.href = '/TableAssignment/Index'; // On successful login, redirect to the dashboard
                    });
                } else
                {
                    alert("[auth.js]\n ResponseData > Invalid login credentials"); // Invalid login
                }
            })
            .catch(error =>
            {
                console.error("\n[auth.js]\n login()", error); // Log the error if the login request fails
                alert("[NOTIFICATION] auth.js > Login failed"); // Show an error alert
            });
    }

    // Attach login function to submit button click
    document.querySelector("button[type='submit']")?.addEventListener("click", function (event)
    {
        event.preventDefault();
        login();
    });
});