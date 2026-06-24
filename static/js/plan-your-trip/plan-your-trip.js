document.addEventListener("DOMContentLoaded", function () {
    let savedCards = localStorage.getItem("savedCards");
    let targetDiv = document.getElementById('destinations-content');

    if (savedCards && targetDiv) {
        console.log("Details Page Detected: Loading saved card data...");
        targetDiv.innerHTML = savedCards;
    } else {
        console.warn("No saved cards found in localStorage or target div missing!");
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const openPreferencesBtn = document.getElementById("open-preferences");
    const preferencesForm = document.getElementById("preferences-form");
    const savePreferencesBtn = document.getElementById("save-preferences");

    if (openPreferencesBtn && preferencesForm && savePreferencesBtn) {
        openPreferencesBtn.addEventListener("click", function () {
            preferencesForm.classList.remove("hidden");
        });

        savePreferencesBtn.addEventListener("click", function () {
            preferencesForm.classList.add("hidden");
            filterCards(); // Apply only filtering
        });
    }
});

function filterCards() {
    const selectedLocation = document.getElementById("location").value;
    const selectedTags = Array.from(document.querySelectorAll("#preferences-form input:checked"))
        .map(input => input.value);

    const cards = document.querySelectorAll("#places-list .destination-card");

    cards.forEach(card => {
        const cardLocation = card.getAttribute("data-location") || "";
        const cardTags = card.getAttribute("data-tags") ? card.getAttribute("data-tags").split(",") : [];

        // Check if the card matches the selected location and at least one selected preference
        const matchesLocation = selectedLocation === "" || cardLocation === selectedLocation;
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => cardTags.includes(tag));

        if (matchesLocation && matchesTags) {
            card.style.display = "inline-block";
        } else {
            card.style.display = "none";
        }
    });
}
