function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        title: params.get("title") || "Unknown Destination",
        image: params.get("image") || "default.jpg",
        location: params.get("location") || "Unknown",
        description: params.get("description") || "No description available."
    };
}

// Get data from URL
const destinationData = getQueryParams();

// Insert data into HTML
document.getElementById("destination-title").textContent = destinationData.title;
document.getElementById("destination-image").src = destinationData.image;
document.getElementById("destination-location").textContent = destinationData.location;
document.getElementById("destination-description").textContent = destinationData.description;

// Animate with GSAP
gsap.to(".container", { opacity: 1, duration: 1, y: -20 });