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
        customerName: getCookie("CustomerName")
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

    // Filter de bestellingen op basis van de huidige orderId uit de cookies
    const filteredOrders = confirmedOrders.filter(order => order.orderId.toString() === cookieData.orderId);
    console.log("Matched order with orderId:", filteredOrders);

    // Bereken het totaal voor de gefilterde bestellingen
    const totalPrice = filteredOrders.reduce((total, order) => total + parseFloat(cookieData.orderPrice), 0);

    // Haal de tbody elementen op
    const tableCurrentOrder = document.getElementById("displayCurrentOrder");
    const tableDisplayTotalPrice = document.getElementById("displayTotalPrice");

    if (!tableCurrentOrder || !tableDisplayTotalPrice) return;

    // Maak de HTML voor de bestellingen
    let rows = filteredOrders.map(order => `
        <tr>
            <td class="table-cell">${cookieData.orderId}</td>
            <td class="table-cell">${cookieData.orderDate}</td>
            <td class="table-cell">${cookieData.orderTime}</td>
            <td class="table-cell">${order.order}</td>
            <td class="table-cell">${cookieData.orderPrice ?? 'Onbekend'}</td>
            <td>
                <button type="button"
                        class="btn btn-success"
                        id="saveOrderbtn">
                        GeefDezeButtonEenFunctie
                </button>
            </td>
        </tr>
    `).join("");

    // Voeg de rijen toe voor de bestellingen
    tableCurrentOrder.innerHTML = rows;

    // Voeg de totaalsom toe als extra rij onderaan de tabel
    tableDisplayTotalPrice.innerHTML = `
        <tr>
            <td colspan="4" class="table-cell">Totaal</td>
            <td class="table-cell">${totalPrice.toFixed(2)} EUR</td>
            <td></td>
        </tr>
    `;
}