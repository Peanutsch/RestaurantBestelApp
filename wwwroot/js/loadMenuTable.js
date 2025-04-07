document.addEventListener("DOMContentLoaded", function ()
{
    fetch('/DisplayMenu/GetMenuItems', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
        .then(displayMenu)
        .catch(error => console.error("Request failed:", error)); // Log errors if the request fails
});

function displayMenu(menu)
{
    const menuTableBody = document.getElementById("userTableBody");

    if (!menuTableBody) return; // Exit if table body is not found

    // Generate the table rows in one operation and insert them into the DOM
    menuTableBody.innerHTML = menu.map(Dbmenu => `
        <tr>
            <td class="table-cell">${Dbmenu.dish}</td>
            <td class="table-cell">${Dbmenu.type}</td>
            <td class="table-cell">${Dbmenu.info}</td>
            <td class="table-cell">${Dbmenu.price.toFixed(2)}</td>
            <td class="table-cell">
                <input type="number" id="itemvalue" name="quantity" min="0" style="width: 80px" class="form-control">
            </td>
        </tr>
    `).join("");
}