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
                    });
                }
            });
        }
    });
});
