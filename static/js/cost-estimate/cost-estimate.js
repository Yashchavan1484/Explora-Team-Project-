function calculateCost() {
    const destination = document.getElementById("destination").value;
    const days = parseInt(document.getElementById("days").value);
    const travelType = document.querySelector('input[name="travel-type"]:checked').value;
    const selectedCosts = Array.from(document.querySelectorAll(".checkbox-group input:checked"))
        .map(input => input.value);

    // Static cost data (can be replaced with API calls later)
    const costData = {
        flight: { solo: 200, couple: 350, family: 600, group: 800 },
        hotel: { solo: 50, couple: 80, family: 150, group: 200 },
        food: { solo: 20, couple: 35, family: 60, group: 80 },
        transport: { solo: 10, couple: 20, family: 40, group: 60 },
        activities: { solo: 30, couple: 50, family: 80, group: 100 }
    };

    let totalCost = 0;
    let breakdownText = "";

    selectedCosts.forEach(category => {
        if (costData[category]) {
            const categoryCost = costData[category][travelType] * days;
            totalCost += categoryCost;
            breakdownText += `<strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong> $${categoryCost} <br>`;
        }
    });

    document.getElementById("breakdown").innerHTML = breakdownText;
    document.getElementById("total-cost").innerHTML = `Total: $${totalCost}`;
}