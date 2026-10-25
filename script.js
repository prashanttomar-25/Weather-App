console.log("JavaScript connected successfully!");

"use strict";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const weatherInfo = document.getElementById("weather-info");
const searchButton = document.getElementById("search-button");

const weatherCodes = {
0: ["Clear Sky", "☀️"],
1: ["Mainly Clear", "🌤️"],
2: ["Partly Cloudy", "⛅"],
3: ["Overcast", "☁️"],
45: ["Foggy", "🌫️"],
48: ["Rime Fog", "🌫️"],
51: ["Light Drizzle", "🌦️"],
53: ["Moderate Drizzle", "🌦️"],
55: ["Heavy Drizzle", "🌧️"],
61: ["Light Rain", "🌦️"],
63: ["Moderate Rain", "🌧️"],
65: ["Heavy Rain", "🌧️"],
71: ["Light Snow", "🌨️"],
73: ["Moderate Snow", "🌨️"],
75: ["Heavy Snow", "❄️"],
80: ["Rain Showers", "🌦️"],
81: ["Moderate Rain Showers", "🌧️"],
82: ["Heavy Rain Showers", "⛈️"],
95: ["Thunderstorm", "⛈️"],
96: ["Thunderstorm with Hail", "⛈️"],
99: ["Heavy Thunderstorm", "⛈️"]
};

form.addEventListener("submit", async function (event) {
    console.log("Search button clicked!");
event.preventDefault();

const city = cityInput.value.trim();

if (!city) {
    message.textContent = "Please enter a city name.";
    return;
}

searchButton.disabled = true;
message.textContent = "Loading weather...";
weatherInfo.classList.add("hidden");

try {
    const geoURL =
        "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(city) +
        "&count=1&language=en&format=json";

    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) {
        throw new Error("Unable to search for the city.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Check the spelling.");
    }

    const location = geoData.results[0];

    const weatherURL =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        location.latitude +
        "&longitude=" +
        location.longitude +
        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto";

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
        throw new Error("Unable to fetch weather data.");
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current) {
        throw new Error("Weather data is unavailable.");
    }

    const current = weatherData.current;

    const weather = weatherCodes[current.weather_code] ||
        ["Unknown Weather", "🌡️"];

    document.getElementById("city-name").textContent =
        location.name + ", " + (location.country || "");

    document.getElementById("temperature").textContent =
        Math.round(current.temperature_2m) + "°C";

    document.getElementById("condition").textContent =
        weather[0];

    let icon = weather[1];

    if (current.is_day === 0 && current.weather_code === 0) {
        icon = "🌙";
    }

    document.getElementById("weather-icon").textContent = icon;

    document.getElementById("humidity").textContent =
        current.relative_humidity_2m + "%";

    document.getElementById("wind").textContent =
        current.wind_speed_10m + " km/h";

    document.getElementById("feels-like").textContent =
        "Feels like: " +
        Math.round(current.apparent_temperature) + "°C";

    weatherInfo.classList.remove("hidden");
    message.textContent = "";

} catch (error) {
    console.error("Weather App Error:", error);

    message.textContent =
        error.message || "Something went wrong. Please try again.";

} finally {
    searchButton.disabled = false;
}

});
