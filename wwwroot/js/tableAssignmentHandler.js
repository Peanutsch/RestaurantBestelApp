document.addEventListener("DOMContentLoaded", function ()
{
    var saveCustomerCheckInButton = document.getElementById("saveCustomerCheckIn");

    if (saveCustomerCheckInButton)
    {
        saveCustomerCheckInButton.addEventListener("click", function ()
        {
            var customerName = document.getElementById("CustomerName").value.trim();
            var tableNumber = document.getElementById("TableNumber").value;
            var employee = document.getElementById("Employee").value;

            if (!customerName)
            {
                Swal.fire({
                    icon: "error",
                    title: "Fout!",
                    text: "Voer een klantnaam in voordat je doorgaat.",
                });
                return;
            }

            Swal.fire({
                title: "Graag Check-in bevestigen",
                html: `<strong>Naam: ${customerName.toUpperCase()}</strong><br>
                       <strong>Tafel: ${tableNumber}</strong>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Opslaan",
                cancelButtonText: "Annuleer"
            }).then((result) =>
            {
                if (result.isConfirmed)
                {
                    document.cookie = `CustomerName=${encodeURIComponent(customerName)}; path=/`;
                    document.cookie = `TableNumber=${tableNumber}; path=/`;
                    document.cookie = `Employee=${employee}; path=/`;

                    Swal.fire({
                        toast: true,
                        //position: "top-end",
                        icon: "success",
                        title: "SUCCES!",
                        html: `<strong>[${customerName.toUpperCase()}]</strong><br>wordt ingecheckt<br>
                               voor tafel ${tableNumber}!`,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() =>
                    {
                        window.location.href = "/DisplayMenu/Index";
                    });
                }
            });
        });
    }
});