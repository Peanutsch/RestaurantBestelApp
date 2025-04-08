document.addEventListener("DOMContentLoaded", function ()
{
    fetch('/OrderHistory/GetOrderHistory', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
        .then(displayOrderHistory)
        .catch(error => console.error("Request failed:", error));
});

function displayOrderHistory(orderHistory)
{
    const cookieData = getCookieData();
    var customerName = cookieData.customerName.toLocaleUpperCase();
    var employee = cookieData.employee;

    console.log("Klant:", customerName);
    console.log("Medewerker:", employee);

    // Huidige datum ophalen in het formaat dd-mm-yyyy
    const today = formatDate(new Date());
    console.log("Vandaag:", today);

    // Filter bestellingen van vandaag en voor de specifieke klant
    const todaysOrders = orderHistory.filter(order =>
    {
        console.log("orderDate:", order.date);
        // Filter op zowel de datum als de klantnaam
        return order.date === today && order.customerName === customerName;
    });

    console.log("Bestellingen van vandaag voor de klant:", todaysOrders);

    // Haal het element voor het weergeven van de bestellingen op
    const tableCurrentOrder = document.getElementById("orderhistorytable");
    console.log("tableCurrentOrder:", tableCurrentOrder);

    if (!tableCurrentOrder) return;

    let rows = '';
    // Loop door de gefilterde bestellingen van de klant
    todaysOrders.forEach(order =>
    {
        rows += `
            <tr>
                <td>${order.date}</td>
                <td>${order.time}</td>
                <td>${order.order}</td>
                <td>${order.price}</td>
            </tr>
        `;
    });

    tableCurrentOrder.innerHTML = rows;
}


function formatDate(date)
{
    const day = String(date.getDate()).padStart(2, '0'); // Voorloopnul als de dag minder dan 10 is
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Maanden zijn 0-indexed, dus +1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

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

function getCookieData()
{
    const rawPrice = getCookie("isPrice");
    return {
        orderId: getCookie("isOrderId"),
        orderDate: getCookie("isDate"),
        orderTime: getCookie("isTime"),
        orderPrice: rawPrice ? parseFloat(rawPrice).toFixed(2) : "0.00",
        customerName: getCookie("CustomerName"),
        orderStatus: getCookie("isStatus"),
        orderTableNumber: getCookie("TableNumber"),
        employee: getCookie("Employee")
    };
}
