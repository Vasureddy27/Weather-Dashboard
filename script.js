// OpenWeatherMap API key
const apiKey = "24d1b33d5fc39ebe31fb4f7b331bf9bf";

// DOM elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const locationButton = document.getElementById("location-button");
const unitRadios = document.querySelectorAll('input[name="unit"]');
const currentWeather = document.getElementById("current-weather");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const pressureElement = document.getElementById("pressure");
const realFeelElement = document.getElementById("real-feel");
const sunriseElement = document.getElementById("sunrise");
const sunsetElement = document.getElementById("sunset");
const forecastCardsContainer = document.getElementById("forecast-cards");

// Event listeners
searchButton.addEventListener("click", () => {
  const city = searchInput.value;
  if (city) {
    getWeatherByCity(city);
  }
});

locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByLocation(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

unitRadios.forEach((radio) => {
  radio.addEventListener("change", updateUnits);
});

// Fetch weather by city
function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeatherData(url);
}

// Fetch weather by location
function getWeatherByLocation(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  fetchWeatherData(url);
}

// Fetch weather data from API
function fetchWeatherData(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return response.json();
    })
    .then((data) => {
      displayCurrentWeather(data);
      fetchForecastData(data.coord.lat, data.coord.lon); // Fetch forecast data separately
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again.");
    });
}

// Fetch forecast data from API
function fetchForecastData(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(forecastUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch forecast data");
      }
      return response.json();
    })
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
      alert("Error fetching forecast data. Please try again.");
    });
}

// Display current weather data
function displayCurrentWeather(data) {
  const currentTemperature = data.main.temp.toFixed(1);
  const dateTime = formatDateTime(data.dt, data.timezone);
  const cityCountry = `${data.name}, ${data.sys.country}`;
  const sunriseTime = formatTime(data.sys.sunrise, data.timezone);
  const sunsetTime = formatTime(data.sys.sunset, data.timezone);

  currentWeather.innerHTML = `
    <h2 id="city-country">${cityCountry}</h2>
      <h2>${dateTime}</h2>
    <h2 id="temperature">${currentTemperature}°C</h2>
    <div class="current-status">
      <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
      <p>${data.weather[0].description}</p>
    </div>
    <div class="additional-info"></div>
  `;

  humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  pressureElement.textContent = `Pressure: ${data.main.pressure} h/Pa`;
  realFeelElement.textContent = `Real Feel: ${data.main.feels_like.toFixed(
    1
  )}°C`;
}

// Display forecast data
function displayForecast(data) {
  forecastCardsContainer.innerHTML = "";

  const datesSeen = new Set();
  const forecastDays = [];

  for (let i = 0; i < data.list.length; i++) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const dateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    if (!datesSeen.has(dateString) && date > new Date()) {
      datesSeen.add(dateString);
      forecastDays.push(forecast);
    }

    if (forecastDays.length === 5) {
      break;
    }
  }

  forecastDays.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const monthDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
    const temperature = forecast.main.temp.toFixed(1);
    const weatherDescription = forecast.weather[0].description;

    const card = `
      <div class="forecast-card">
        <div>${day}</div>
        <div>${monthDate}</div>
        <img src="${weatherIcon}" alt="${weatherDescription}">
        <div class="forecast-temp">${temperature}°C</div>
        <div>${weatherDescription}</div>
      </div>
    `;

    forecastCardsContainer.innerHTML += card;
  });
}

// Format date and time
function formatDateTime(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  };
  return date.toLocaleString("en-US", options);
}

// Format time (for sunrise and sunset)
function formatTime(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const options = {
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  };
  return date.toLocaleTimeString("en-US", options);
}

// Update temperature units
function updateUnits() {
  const selectedUnit = document.querySelector(
    'input[name="unit"]:checked'
  ).value;

  // Update current temperature
  const tempElement = document.getElementById("temperature");
  if (tempElement) {
    let tempValue = parseFloat(tempElement.textContent);
    tempValue = convertTemperature(tempValue, selectedUnit);
    tempElement.textContent = `${tempValue.toFixed(1)}°${
      selectedUnit === "fahrenheit" ? "F" : "C"
    }`;
  }

  // Update real feel temperature
  const realFeelText = realFeelElement.textContent.split(" ");
  let realFeelValue = parseFloat(realFeelText[2]);
  realFeelValue = convertTemperature(realFeelValue, selectedUnit);
  realFeelElement.textContent = `Real Feel: ${realFeelValue.toFixed(1)}°${
    selectedUnit === "fahrenheit" ? "F" : "C"
  }`;

  // Update forecast temperatures
  const forecastTemps = document.querySelectorAll(".forecast-temp");
  forecastTemps.forEach((card) => {
    let forecastTempValue = parseFloat(card.textContent);
    forecastTempValue = convertTemperature(forecastTempValue, selectedUnit);
    card.textContent = `${forecastTempValue.toFixed(1)}°${
      selectedUnit === "fahrenheit" ? "F" : "C"
    }`;
  });
}

// Convert temperature based on selected unit
function convertTemperature(value, unit) {
  if (unit === "fahrenheit") {
    return (value * 9) / 5 + 32;
  } else {
    return ((value - 32) * 5) / 9;
  }
}

// Example usage: Fetch weather data by city name
const defaultCity = "Sukkur";
getWeatherByCity(defaultCity);
