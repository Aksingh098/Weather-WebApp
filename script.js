const API_KEY = "077199c5c577b1d609650c043e5d79db";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const ICON_URL = "https://openweathermap.org/img/wn";


const cityInput = document.getElementById("city_input");
const searchBtn = document.getElementById("searchButton");
const locationBtn = document.getElementById("locationButton");

const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const weatherIconEl = document.getElementById("weatherIcon");
const dateDisplayEl = document.getElementById("dateDisplay");
const locationDisplayEl = document.getElementById("locationDisplay");

const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelsLikeEl = document.getElementById("feelsLike");
const pressureEl = document.getElementById("pressure");
const visibilityEl = document.getElementById("visibility");
const cloudinessEl = document.getElementById("cloudiness");

const forecastListEl = document.getElementById("forecastList");


//EventListeners
searchBtn.addEventListener("click", handleSearch);
locationBtn.addEventListener("click", handleUseCurrentLocation);

cityInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        handleSearch();
    }
});

//onFirstLoad
loadWeatherForCity("New Delhi");

function handleSearch() {
    const city = cityInput.value.trim();
    if (city === "") {
        return;
    }
    loadWeatherForCity(city);
}

function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
        renderError("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            loadWeatherForCoords(lat, lon);
        },
        function () {
            renderError("Location permission denied");
        }
    );
}

async function loadWeatherForCity(city) {
    try {
        const currentUrl = BASE_URL + "/weather?q=" + city + "&units=metric&appid=" + API_KEY;
        const forecastUrl = BASE_URL + "/forecast?q=" + city + "&units=metric&appid=" + API_KEY;

        const currentResponse = await fetch(currentUrl);
        if (!currentResponse.ok) {
            renderError("City not found");
            return;
        }
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        renderCurrentWeather(currentData);
        const dailyForecasts = aggregateDailyForecast(forecastData);
        renderForecast(dailyForecasts);

    } catch (error) {
        console.error("Error fetching weather data", error);
        renderError("Something went wrong");
    }
}

async function loadWeatherForCoords(lat, lon) {
    try {
        const currentUrl = BASE_URL + "/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + API_KEY;
        const forecastUrl = BASE_URL + "/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + API_KEY;

        const currentResponse = await fetch(currentUrl);
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        renderCurrentWeather(currentData);
        const dailyForecasts = aggregateDailyForecast(forecastData);
        renderForecast(dailyForecasts);

    } catch (error) {
        console.error("Error fetching weather data", error);
        renderError("Something went wrong");
    }
}

function aggregateDailyForecast(forecastData) {
    const groupedByDate = {}; 
    for (let i = 0; i < forecastData.list.length; i++) {
        const entry = forecastData.list[i];
        const datePart = entry.dt_txt.split(" ")[0]; // e.g. "2026-07-14"
        const timePart = entry.dt_txt.split(" ")[1]; // e.g. "12:00:00"
        const hour = Number(timePart.split(":")[0]);

       
        if (!groupedByDate[datePart]) {
            groupedByDate[datePart] = {
                min: entry.main.temp_min,
                max: entry.main.temp_max,
                closestHour: hour,
                icon: entry.weather[0].icon,
                description: entry.weather[0].description
            };
        }

        const bucket = groupedByDate[datePart];

        
        if (entry.main.temp_min < bucket.min) {
            bucket.min = entry.main.temp_min;
        }
        if (entry.main.temp_max > bucket.max) {
            bucket.max = entry.main.temp_max;
        }

        
        const distanceFromNoon = Math.abs(hour - 12);
        const currentClosestDistance = Math.abs(bucket.closestHour - 12);
        if (distanceFromNoon < currentClosestDistance) {
            bucket.closestHour = hour;
            bucket.icon = entry.weather[0].icon;
            bucket.description = entry.weather[0].description;
        }
    }

    
    const allDates = Object.keys(groupedByDate);
    const days = [];
    for (let i = 0; i < allDates.length; i++) {
        const date = allDates[i];
        const bucket = groupedByDate[date];
        days.push({
            date: date,
            min: Math.round(bucket.min),
            max: Math.round(bucket.max),
            icon: bucket.icon,
            description: bucket.description
        });
    }

    
    return days.slice(1, 6);
}

function renderCurrentWeather(data) {
    temperatureEl.textContent = Math.round(data.main.temp) + "°C";
    descriptionEl.textContent = capitalize(data.weather[0].description);
    weatherIconEl.src = ICON_URL + "/" + data.weather[0].icon + "@2x.png";
    weatherIconEl.alt = data.weather[0].description;

    dateDisplayEl.textContent = formatDate(new Date());
    locationDisplayEl.textContent = data.name + ", " + data.sys.country;

    humidityEl.textContent = data.main.humidity;
    windEl.textContent = Math.round(data.wind.speed * 3.6); 
    feelsLikeEl.textContent = Math.round(data.main.feels_like);
    pressureEl.textContent = data.main.pressure;
    visibilityEl.textContent = (data.visibility / 1000).toFixed(1); 
    cloudinessEl.textContent = data.clouds.all;
}

function renderForecast(days) {
    forecastListEl.innerHTML = ""; 

    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });

        const card = document.createElement("div");
        card.className = "forecast-day";
        card.innerHTML =
            "<p class='day'>" + dayName + "</p>" +
            "<img src='" + ICON_URL + "/" + day.icon + ".png' alt='" + day.description + "'>" +
            "<p class='temp-range'>" + day.max + "° / " + day.min + "°</p>";

        forecastListEl.appendChild(card);
    }
}

function renderError(message) {
    descriptionEl.textContent = message;
    temperatureEl.textContent = "--°C";
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short"
    });
}
