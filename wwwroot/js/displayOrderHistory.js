document.addEventListener("DOMContentLoaded", function ()
{
    // Display customername, table, employee
    displayOrderHeader();

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
    const { customerName } = getCustomerData(); // Verkrijg klantnaam
    const today = formatDate(new Date()); // Verkrijg de datum van vandaag in het juiste formaat

    console.log("Vandaag:", today);

    const todaysOrders = getTodaysOrders(orderHistory, today, customerName).reverse(); // Filter bestellingen van vandaag voor de klant
    console.log("Bestellingen van vandaag voor de klant:", todaysOrders);

    // Haal het element voor het weergeven van de bestellingen op
    const tableCurrentOrder = document.getElementById("tableCurrentOrder");
    if (!tableCurrentOrder) return;

    // Genereer de tabelrijen en voeg ze in de tabel
    tableCurrentOrder.innerHTML = generateTableRows(todaysOrders);
}

// Functie om bestellingen van vandaag voor de specifieke klant op te halen
function getTodaysOrders(orderHistory, today, customerName)
{
    return orderHistory.filter(order =>
        order.date === today && order.customerName.toUpperCase() === customerName.toUpperCase()
    );
}

// Functie om de HTML voor de tabelrijen te genereren
function generateTableRows(orders)
{
    return orders.map(order => `
        <tr>
            <td>${order.date}</td>
            <td>${order.time}</td>
            <td>${order.order}</td>
            <td>${order.price.toFixed(2)}</td>
        </tr>
    `).join('');
}

// Functie om de klantgegevens op te halen uit cookies
function getCustomerData()
{
    const { customerName, employee } = getCookieData();
    console.log("Klant:", customerName);
    console.log("Medewerker:", employee);
    return { customerName, employee };
}

// Functie om de datum te formatteren in dd-mm-yyyy
function formatDate(date)
{
    const day = String(date.getDate()).padStart(2, '0'); // Zorgt voor een voorloopnul als de dag minder dan 10 is
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Maanden zijn 0-indexed, dus +1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function displayOrderHeader()
{
    // Toon order info als header
    const orderHeader = document.getElementById("orderHeader");
    const cookieData = getCookieData();

    if (orderHeader)
    {
        orderHeader.innerHTML = `
            <h1>Totaal [${cookieData.customerName.toLocaleUpperCase()}]</h1>
            <h4>Tafel: #${cookieData.orderTableNumber}</h4>
            <p>Medewerker: ${cookieData.employee}<br>
               ${cookieData.orderDate} - ${cookieData.orderTime}</p>
        `;
    }
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
