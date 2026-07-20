# 🌤️ The Weather App

A clean, responsive weather dashboard built with vanilla HTML, CSS, and JavaScript. It shows current conditions, key metrics, and a 5-day forecast for any city — or your current location.

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![HTML5](https://img.shields.io/badge/HTML-5-orange)
![CSS3](https://img.shields.io/badge/CSS-3-blue)

## Features

- 🔍 **Search by city** — look up weather for any city worldwide
- 📍 **Current location** — use the Geolocation API to get weather for where you are
- 🌡️ **Current conditions** — temperature, description, and icon at a glance
- 📊 **Detailed metrics** — humidity, wind speed, feels-like temperature, pressure, visibility, and cloudiness
- 📅 **5-day forecast** — daily high/low with condition icons
- 📱 **Responsive design** — adapts from desktop down to mobile with a dark, modern UI

## Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — CSS Grid/Flexbox layout, custom properties for theming, responsive breakpoints
- **JavaScript (ES6+)** — vanilla JS, `async/await`, Fetch API, no frameworks
- **[OpenWeatherMap API](https://openweathermap.org/api)** — current weather and 5-day/3-hour forecast data
- **[Font Awesome](https://fontawesome.com/)** & **[Boxicons](https://boxicons.com/)** — icon sets
- **Google Fonts** — Space Grotesk (display) and Inter (body)

## Project Structure

```
├── index.html      # Markup and layout structure
├── style.css       # Styling, theming, and responsive design
└── script.js       # API calls, data processing, and DOM rendering
```

## Getting Started

### Prerequisites

- A free API key from [OpenWeatherMap](https://openweathermap.org/api)
- A modern web browser
- (Optional) A local server, e.g. the VS Code "Live Server" extension

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```
2. Open `script.js` and replace the API key with your own:
   ```js
   const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
   ```
3. Open `index.html` in your browser, or serve it with a local server for the best experience (Geolocation may require `https` or `localhost`).

> ⚠️ **Note:** This project currently keeps the API key directly in `script.js` for simplicity. For a public deployment, avoid committing real keys to version control — use environment variables/a build step, or proxy requests through a small backend.

## How It Works

- On load, the app fetches weather for a default city.
- Searching a city or using "Current Location" triggers a call to both the **Current Weather** and **5-Day Forecast** endpoints.
- Forecast data (returned in 3-hour intervals) is grouped by date, picking the reading closest to noon as the representative condition for that day, while tracking the daily min/max temperature.
- The DOM is updated dynamically with the parsed weather data — no page reloads.



