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
    return null;
}

function getCookieData(){
    var isDate = getCookie("cookieDate");
    var order = getCookie("Order");
    var price = getCookie("Price");

    // Toon de waarde van de cookies in de HTML
    var summaryText = `Date: ${isDate} | Order: ${order} | Price: ${price}`;
    document.getElementById("orderSummary").innerText = summaryText;
}