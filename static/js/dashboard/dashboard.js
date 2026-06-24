const ctx1 = document.getElementById('userChart').getContext('2d');
new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'User Growth',
            data: [10, 20, 45, 60, 80, 150],
            borderColor: 'blue',
            borderWidth: 2,
            fill: false
        }]
    }
});

// Booking Chart
const ctx2 = document.getElementById('bookingChart').getContext('2d');
new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Bookings',
            data: [5, 15, 25, 35, 50, 78],
            backgroundColor: 'green'
        }]
    }
});