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
    document.querySelectorAll(".explore-btn2").forEach((button) => {
        button.addEventListener("click", function () {
            console.log("Explore button clicked!"); // Debug message

            const card = this.closest(".destination-card"); // Get parent card
            if (!card) {
                console.error("Error: No destination-card found!");
                return;
            }

            const title = encodeURIComponent(card.querySelector(".card2-title").innerText);
            const image = encodeURIComponent(card.querySelector("img").src);
            const location = encodeURIComponent(card.dataset.location);
            const description = encodeURIComponent(card.querySelector(".card2-content").innerText);

            console.log(`Redirecting to details.html with:
                Title: ${title},
                Image: ${image},
                Location: ${location},
                Description: ${description}`); // Debugging output

            // Redirect to details page
            window.location.href = `../destination-details/details.html?title=${title}&image=${image}&location=${location}&description=${description}`;
        });
    });
});