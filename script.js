const apiKey = "329c280a0673a9cd411d71d1dfe1c9c2";

const weatherUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&lat=";

const geoUrl =
  "https://api.openweathermap.org/geo/1.0/direct?q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const suggestions = document.querySelector(".suggestions");

async function getSuggestions(query) {
    if (query.length < 2) {
        suggestions.style.display = "none";
        return;
    }

    const response = await fetch(
        geoUrl + query + `&limit=5&appid=${apiKey}`
    );
    const data = await response.json();

    suggestions.innerHTML = "";

    data.forEach(place => {
        const div = document.createElement("div");
        div.textContent = `${place.name}, ${place.country}`;
        div.onclick = () => {
            searchBox.value = place.name;
            suggestions.style.display = "none";
            checkWeather(place.lat, place.lon);
        };
        suggestions.appendChild(div);
    });

    suggestions.style.display = "block";
}

async function checkWeather(lat, lon) {
    const response = await fetch(
        weatherUrl + lat + `&lon=${lon}&appid=${apiKey}`
    );
    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
        Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML =
        "Humidity: " + data.main.humidity + "%";
    document.querySelector(".wind").innerHTML =
        "Wind: " + data.wind.speed + " km/h";

    // Clear search input after search
    searchBox.value = "";
}


searchBox.addEventListener("input", () => {
    getSuggestions(searchBox.value.trim());
});

searchBtn.addEventListener("click", () => {
    getSuggestions(searchBox.value.trim());
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) {
        suggestions.style.display = "none";
    }
});
