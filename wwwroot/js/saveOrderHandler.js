document.addEventListener("DOMContentLoaded", function ()
{
    document.addEventListener("click", function (event)
    {
        if (event.target.id === "Bestel")
        {
            const rows = document.querySelectorAll("#userTableBody tr");
            const selectedItems = [];

            rows.forEach(tr =>
            {
                const qtyInput = tr.querySelector('input[name="quantity"]');
                const quantity = parseInt(qtyInput?.value || "0");

                if (quantity > 0)
                {
                    const dish = tr.children[0].innerText.trim();
                    const price = parseFloat(tr.children[3].innerText.trim().replace(',', '.')); // Fix voor NL comma
                    selectedItems.push({ dish, price, quantity });
                }
            });

            if (selectedItems.length === 0)
            {
                Swal.fire("Geen gerecht geselecteerd", "", "warning");
                return;
            }

            // Bouw de HTML voor de bevestigingslijst
            const orderSummaryHTML = selectedItems
                .map(item => `<div>${item.dish.toUpperCase()} (${item.quantity}x) €${(item.price * item.quantity).toFixed(2)}</div>`)
                .join("");

            // Bereken totaalprijs
            const totalPrice = selectedItems
                .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                .toFixed(2);

            // Voeg totaal toe onder de bestelling
            const fullSummaryHTML = `${orderSummaryHTML}<hr><div><strong>Totaal: €${totalPrice}</strong></div>`;


            Swal.fire({
                title: "Bevestig je bestelling",
                html: fullSummaryHTML,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Opslaan",
                cancelButtonText: "Annuleren"
            }).then((result) =>
            {
                if (result.isConfirmed)
                {
                    Swal.fire({
                        toast: true,
                        icon: "success",
                        title: "Uw bestelling is geplaatst!",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() =>
                    {
                        // Alle items doorgeven naar je handler
                        handleMultipleOrders(selectedItems);
                    });
                }
            });
        }
    });

    function handleMultipleOrders(items)
    {
        items.forEach(item =>
        {
            const orderString = `${item.dish} x${item.quantity}`;
            handleOrder(orderString, (item.price * item.quantity).toFixed(2));
        });
    }

    function handleOrder(order, totalPrice)
    {
        fetch('/SaveOrder/GetLastOrderId') // Haal laatste ORDERID op
            .then(response => response.json())
            .then(data =>
            {
                const newOrderId = data.orderId; // Nieuwe ORDERID

                const now = new Date();
                const isTime = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const isDate = now.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });

                const customerName = getCookie("CustomerName");
                const tableNumber = getCookie("TableNumber");

                const confirmedOrder = {
                    OrderId: newOrderId, // ORDERID uit database
                    Date: isDate,
                    Time: isTime,
                    TableNumber: tableNumber.trim().toUpperCase(),
                    CustomerName: customerName.trim().toUpperCase(),
                    Order: order.toUpperCase(),
                    Status: `IN BEHANDELING`,
                    Price: totalPrice
                };
                console.log("JSON Payload:", JSON.stringify(confirmedOrder));
                fetch('/SaveOrder/SaveOrder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('AuthToken')}`
                    },
                    body: JSON.stringify(confirmedOrder),
                    credentials: "include"
                })
                    .then(response => response.json())
                    .then(data =>
                    {
                        if (data.success)
                        {
                            var cookieOrderId = newOrderId;
                            var cookieDate = isDate;
                            var cookieTime = isTime;
                            var cookiePrice = totalPrice;
                            var cookieStatus = 'IN BEHANDELING';

                            document.cookie = `isOrderId=${cookieOrderId}; path=/`;
                            document.cookie = `isDate=${cookieDate}; path=/`; // store date for order summary
                            document.cookie = `isTime = ${cookieTime}; path=/`;
                            document.cookie = `isOrder=${order.toUpperCase()}; path=/`;
                            document.cookie = `isPrice=${cookiePrice}; path=/`;
                            document.cookie = `isStatus=${cookieStatus}; path=/`;

                            window.location.href = "/OrderSummary/Index";
                        } else
                        {
                            alert(`[ERROR] SaveOrder script Error: ${data.message}`);
                        }
                    })
                    .catch(error => console.error("Error:", error));
            })
            .catch(error => console.error("Error fetching OrderId:", error));
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
});

/*
document.addEventListener("DOMContentLoaded", function ()
{
    // SweetAlert for Save Edit Button
    document.addEventListener("click", function (event)
    {
        if (event.target.classList.contains("btn-success"))
        {
            var order = event.target.getAttribute("data-order");

            // Splits de data-order string in twee delen
            var orderData = order.split(',');

            var dish = orderData[0];  // Het gerecht
            var price = orderData[1]; // De prijs

            Swal.fire({
                title: "Bevestig je bestelling",
                html: `<strong>[${dish.toUpperCase()} €${price}]</strong>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Opslaan",
                cancelButtonText: "Annuleren"
            }).then((result) =>
            {
                if (result.isConfirmed)
                {
                    Swal.fire({
                        toast: true,
                        icon: "success",
                        title: "Uw bestelling is geplaatst!",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() =>
                    {
                        handleOrder(dish, price);
                    });
                }
            });
        }
    });


    function handleOrder(order, price)
    {
        fetch('/SaveOrder/GetLastOrderId') // Haal laatste ORDERID op
            .then(response => response.json())
            .then(data =>
            {
                const newOrderId = data.orderId; // Nieuwe ORDERID

                const now = new Date();
                const isTime = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const isDate = now.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });

                const customerName = getCookie("CustomerName");
                const tableNumber = getCookie("TableNumber");    

                const confirmedOrder = {
                    OrderId: newOrderId, // ORDERID uit database
                    Date: isDate,
                    Time: isTime,
                    TableNumber: tableNumber.trim().toUpperCase(),
                    CustomerName: customerName.trim().toUpperCase(),
                    Order: order.toUpperCase(),
                    Status: `IN BEHANDELING`,
                    Price: price
                };
                console.log("JSON Payload:", JSON.stringify(confirmedOrder));
                fetch('/SaveOrder/SaveOrder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('AuthToken')}`
                    },
                    body: JSON.stringify(confirmedOrder),
                    credentials: "include"
                })
                    .then(response => response.json())
                    .then(data =>
                    {
                        if (data.success)
                        {
                            var cookieOrderId = newOrderId;
                            var cookieDate = isDate;
                            var cookieTime = isTime;
                            var cookiePrice = price;
                            var cookieStatus = 'IN BEHANDELING';
                            
                            document.cookie = `isOrderId=${cookieOrderId}; path=/`;
                            document.cookie = `isDate=${cookieDate}; path=/`; // store date for order summary
                            document.cookie = `isTime = ${ cookieTime }; path=/`;
                            document.cookie = `isOrder=${order.toUpperCase()}; path=/`;
                            document.cookie = `isPrice=${cookiePrice}; path=/`;
                            document.cookie = `isStatus=${cookieStatus}; path=/`;

                            window.location.href = "/OrderSummary/Index";
                        } else
                        {
                            alert(`[ERROR] SaveOrder script Error: ${data.message}`);
                        }
                    })
                    .catch(error => console.error("Error:", error));
            })
            .catch(error => console.error("Error fetching OrderId:", error));
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
});
*/