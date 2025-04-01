document.addEventListener("DOMContentLoaded", function ()
{
    function getCookie(name)
    {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++)
        {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(name + '='))
            {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
        return "";
    }

    document.getElementById("Customer").value = getCookie("CustomerName");
    document.getElementById("TableNumber").value = getCookie("TableNumber");
});