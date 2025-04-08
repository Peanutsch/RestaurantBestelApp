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

document.addEventListener("DOMContentLoaded", function ()
{
    fetch('/OrderSummary/SummaryOrderItems', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not OK'))
        .then(displayOrderSummary)
        .catch(error => console.error("Request failed:", error)); // Log errors if the request fails
});

function displayOrderSummary(confirmedOrders)
{
    const cookieData = getCookieData();
    console.log("Klant orderId:", cookieData.orderId);
    console.log("Medewerker:", cookieData.employee);

    // Filter bestellingen op basis van orderId
    const filteredOrders = confirmedOrders.filter(order => order.orderId.toString() === cookieData.orderId);
    console.log("Matched order with orderId:", filteredOrders);

    // Bereken het totaalbedrag
    const totalPrice = filteredOrders.reduce((total, order) => total + parseFloat(cookieData.orderPrice), 0);

    // Haal de tbody elementen op
    const tableCurrentOrder = document.getElementById("displayCurrentOrder");
    const tableDisplayTotalPrice = document.getElementById("displayTotalPrice");

    if (!tableCurrentOrder || !tableDisplayTotalPrice) return;

    // Toon order info als header
    const orderHeader = document.getElementById("orderHeader");
    if (orderHeader)
    {
        orderHeader.innerHTML = `
            <h1>Besteloverzicht ${cookieData.customerName.toLocaleUpperCase()}</h1>
            <h4>OrderID: #${cookieData.orderId}</h4>
            <h4>Tafel: #${cookieData.orderTableNumber}</h4>
            <br>
            <p>Medewerker: ${cookieData.employee}<br>
               ${cookieData.orderDate} - ${cookieData.orderTime}</p>
            <p></p>
        `;
    }

    // Bouw de HTML
    let rows = filteredOrders.map(order => `
        <tr>
            <td class="table-cell">${cookieData.orderDate}</td>
            <td class="table-cell">${cookieData.orderTime}</td>
            <td class="table-cell">${order.order}</td>
            <td class="table-cell">${cookieData.orderPrice ?? '10000000000000000000'}</td>
            <td class="table-cell">${cookieData.orderStatus}</td>
        </tr>
    `).join("");

    tableCurrentOrder.innerHTML = rows;

    tableDisplayTotalPrice.innerHTML = `
        <tr>
            <td colspan="3" class="table-cell"><strong>Totaal</strong></td>
            <td class="table-cell" style="background-color: blue; color: white;"><strong>€${totalPrice.toFixed(2)}</strong></td>
            <td>
                <button 
                    type="button" class="btn btn-success"
                    id="BackToMenu">Terug naar Menu
                </button>
            </td>
        </tr>
    `;

    BackToMenuHandler(filteredOrders);
}

function BackToMenuHandler(filteredOrders)
{
    const allCompleted = filteredOrders.every(order => order.orderStatus === "Afgehandeld");
    const backToMenuButton = document.getElementById("BackToMenu");
    if (!allCompleted)
    {
        //backToMenuButton.disabled = true;
    }
}