var map = L.map('map').setView([20, 0], 2); // Default view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 2. Get references to your HTML elements
const search_input = document.querySelector(".ip-input");
const search_button = document.querySelector(".search_button");
const info_element = document.querySelector(".element");

// Function to update the info display
function updateInfo(data) {
    const location = data.location;
    info_element.innerHTML = `
                <div class="info">
                    <div class="info-title">IP Address</div>
                    <div class="info-data">${data.ip}</div>
                </div>
                <div class="info">
                    <div class="info-title">Location</div>
                    <div class="info-data">${location.city}, ${location.country} ${location.postalCode || ''}</div>
                </div>
                <div class="info">
                    <div class="info-title">Timezone</div>
                    <div class="info-data">UTC ${location.timezone}</div>
                </div>
                <div class="info">
                    <div class="info-title">ISP</div>
                    <div class="info-data">${data.isp}</div>
                </div>`;
}

function searchIp(ipAddress = '') {

    const apiKey = "at_5UUiN8MvbOAHSMbPYt5vCI3JLv89j";
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not fetch data for that IP address.");
            }
            return response.json();
        })
        .then(data => {

            updateInfo(data);

            const lat = data.location.lat;
            const lng = data.location.lng;
            map.setView([lat, lng], 13);
            L.marker([lat, lng]).addTo(map);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please check the IP address and try again.");
        });
}


search_button.addEventListener("click", () => {
    const ip = search_input.value.trim();
    searchIp(ip);
});

search_input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const ip = search_input.value.trim();
        searchIp(ip);
    }
});

window.addEventListener('load', () => {
    searchIp(); // Search for the user's own IP on load
});
