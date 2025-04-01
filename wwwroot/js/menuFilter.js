function menuFilter()
{
    const filter = document.getElementById("searchInput").value.toLowerCase();  // Verkrijg en zet om naar lowercase
    const rows = document.querySelectorAll("#userTableBody tr");  // Verkrijg alle rijen

    rows.forEach(row =>
    {
        const cells = row.getElementsByTagName("td");  // Verkrijg de cellen van de rij
        const found = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filter)); // Controleer of een van de cellen overeenkomt met de zoekterm

        row.style.display = found ? "" : "none";  // Toon of verberg de rij afhankelijk van de zoekresultaten
    });
}