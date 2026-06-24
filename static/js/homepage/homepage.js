
gsap.to(".plane", {
    x: window.innerWidth,
    scrollTrigger: {
        trigger: ".hero-section",
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
    },
});



// Handle opening and closing of the preferences selection form
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
        });
    }
});    document.addEventListener("DOMContentLoaded", function () {
        let cardContainer = document.getElementsByClassName('card2-container')[0];

        if (cardContainer) {
            console.log("Index Page Detected: Storing card data...");
            localStorage.setItem("savedCards", cardContainer.innerHTML);
        } else {
            console.error("Error: .card2-container not found!");
        }
    });
    document.querySelectorAll('.explore-btn2').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.destination-card'); // Get the parent card
            const title = encodeURIComponent(card.querySelector('.card2-title').innerText);
            const image = encodeURIComponent(card.querySelector('img').src);
            const location = encodeURIComponent(card.dataset.location);
            const description= encodeURIComponent(card.querySelector('.card2-content').innerText);
            // Redirect to details.html with query parameters
        window.location.href=`../destination-details/details.html?title=${title}&image=${image}&location=${location}&description=${description}`;
        });
    });







