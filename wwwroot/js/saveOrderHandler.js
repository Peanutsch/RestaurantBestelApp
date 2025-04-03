document.addEventListener("DOMContentLoaded", function ()
{
    // SweetAlert for Save Edit Button
    document.addEventListener("click", function (event)
    {
        if (event.target.classList.contains("btn-success"))
        { // Controleer of een 'Bestel' knop is aangeklikt
            var order = event.target.getAttribute("data-order");

            Swal.fire({
                title: "Bevestig je bestelling",
                html: `<strong>[${order.toUpperCase()}]</strong>`,
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
                        //position: "top-end",
                        icon: "success",
                        title: "Uw bestelling is geplaatst!",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() =>
                    {
                        console.log(`Bestelling ontvangen:\n${order.toUpperCase()}`);
                        handleOrder(order);
                    });
                }
            });
        }
    });

    function handleOrder(order)
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
                    Status: `IN BEHANDELING`
                };

                console.log(`[confirmedOrder]\nOrderId: ${confirmedOrder.OrderId} Date: ${confirmedOrder.Date} Time: ${confirmedOrder.Time} TableNumber: ${confirmedOrder.TableNumber} CustomerName: ${confirmedOrder.CustomerName} Order: ${confirmedOrder.Order} Status: ${confirmedOrder.Status}`);
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
                            window.location.href = "/OrderSummary/Index";
                        } else
                        {
                            alert(`[ERROR] SaveOrder script Error: ${data.message}`);
                            //window.location.href = "/OrderSummary/Index";
                        }
                    })
                    .catch(error => console.error("Error:", error));
            })
            .catch(error => console.error("Error fetching OrderId:", error));
    }



    /*
    function handleOrder(order)
    {
        const now = new Date();
        const isTime = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const isDate = now.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const customerName = getCookie("CustomerName");
        const tableNumber = getCookie("TableNumber");

        const confirmedOrder = {
            orderId: isOrderId,
            Date: isDate,
            Time: isTime,
            TableNumber: tableNumber.trim().toUpperCase(),
            CustomerName: customerName.trim().toUpperCase(),
            Order: order.toUpperCase(),
            Status: `IN BEHANDELING`
        };

        console.log(`[confirmedOrder]\nOrderId: ${confirmedOrder.orderId} Date: ${confirmedOrder.Date} Time: ${confirmedOrder.Time} TableNumber: ${confirmedOrder.TableNumber} CustomerName: ${confirmedOrder.CustomerName.toUpperCase()} Order: ${confirmedOrder.Order} Status: ${confirmedOrder.Status}`)

        fetch('/SaveOrder/SaveOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('AuthToken')}`
            },
            body: JSON.stringify(confirmedOrder),
            credentials: "include"
        })
            .then(response =>
            {
                console.log(`Response Log: `, response);

                return response.json();
            })
            .then(data =>
            {
                if (data.succes)
                {
                    window.location.href = "/OrderSummary/Index";
                } else
                {
                    alert(`[ERROR] SaveOrder script Error: ${data.message}`);
                    window.location.href = "/OrderSummary/Index";
                    //console.error("Validation Errors:", data.errors);
                }
            })
            .catch(error => console.error("Error:", error));
    }
    */

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
