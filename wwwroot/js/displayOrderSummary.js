document.addEventListener("DOMContentLoaded", function ()
{
    fetch('/OrderHistory/GetOrderHistory', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
        .then(displayOrderSummary)
        .catch(error => console.error("Request failed:", error));
});

function displayOrderSummary(confirmedOrders)
{
    const cookieData = getCookieData();
    const filteredOrders = getOrdersByOrderId(confirmedOrders, cookieData.orderId);
    const totalPrice = calculateTotalPrice(filteredOrders, cookieData.orderPrice);

    displayHeaderInfo(cookieData);
    displayOrderRows(filteredOrders, cookieData);
    displayTotalRow(totalPrice);
}

function getOrdersByOrderId(orders, orderId)
{
    return orders.filter(order => order.orderId.toString() === orderId);
}

function calculateTotalPrice(orders, unitPrice)
{
    return orders.reduce((total, _) => total + parseFloat(unitPrice), 0);
}

function displayHeaderInfo(cookieData)
{
    const orderHeader = document.getElementById("orderHeader");
    if (!orderHeader) return;

    orderHeader.innerHTML = `
        <h1>Besteloverzicht ${cookieData.customerName.toLocaleUpperCase()}</h1>
        <h4>Tafel: #${cookieData.orderTableNumber} 
            <span style="margin-left: 80px;">OrderID: #${cookieData.orderId}</span></h4>
        <p>Medewerker: ${cookieData.employee}<br>
           ${cookieData.orderDate} - ${cookieData.orderTime}</p>
    `;
}

function displayOrderRows(orders, cookieData)
{
    const tableCurrentOrder = document.getElementById("displayCurrentOrder");
    if (!tableCurrentOrder) return;

    const rows = orders.map(order => `
        <tr>
            <td class="table-cell">${cookieData.orderDate}</td>
            <td class="table-cell">${cookieData.orderTime}</td>
            <td class="table-cell">${order.order}</td>
            <td class="table-cell">${cookieData.orderPrice ?? '0.00'}</td>
            <td class="table-cell">${cookieData.orderStatus}</td>
        </tr>
    `).join("");

    tableCurrentOrder.innerHTML = rows;
}

function displayTotalRow(totalPrice)
{
    const tableDisplayTotalPrice = document.getElementById("displayTotalPrice");
    if (!tableDisplayTotalPrice) return;

    tableDisplayTotalPrice.innerHTML = `
        <tr>
            <td colspan="3" class="table-cell"><strong>Totaal</strong></td>
            <td class="table-cell" style="background-color: blue; color: white;">
                <strong>€${totalPrice.toFixed(2)}</strong>
            </td>
            <td>
                <button type="button" class="btn btn-success" id="BackToMenu">Terug naar Menu</button>
            </td>
        </tr>
    `;
}

// Cookie utilities
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

function getCookie(name)
{
    const cookies = document.cookie.split(';');
    for (let cookie of cookies)
    {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '='))
        {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}
