const API_KEY = "58baa5ae77531660e5c93be482641cab";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const details = document.getElementById("details");
const weatherIcon = document.getElementById("weather-icon");
const errorMessage = document.getElementById("error-message");
const toggleUnitBtn = document.getElementById("toggle-unit");
let isCelsius = true;
let currentWeather = null;

async function fetchWeather(city) {
  try {
    errorMessage.textContent = "";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    currentWeather = data;
    displayWeather(data);
  } catch (err) {
    errorMessage.textContent = err.message;
    cityName.textContent = "--";
    temperature.textContent = "-- °C";
    description.textContent = "--";
    details.textContent = "";
    weatherIcon.className = "wi";
  }
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  const tempC = data.main.temp;
  const tempF = (tempC * 9/5 + 32).toFixed(1);
  temperature.textContent = isCelsius ? `${tempC.toFixed(1)} °C` : `${tempF} °F`;
  description.textContent = data.weather[0].description;
  details.textContent = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} km/h`;

  // set icon
  const mainWeather = data.weather[0].main.toLowerCase();
  setWeatherIcon(mainWeather);

  // change background dynamically
  setBackground(mainWeather);
}

function setWeatherIcon(condition) {
  let iconClass = "wi wi-day-sunny";
  if (condition.includes("cloud")) iconClass = "wi wi-cloudy";
  else if (condition.includes("rain")) iconClass = "wi wi-rain";
  else if (condition.includes("snow")) iconClass = "wi wi-snow";
  else if (condition.includes("thunder")) iconClass = "wi wi-thunderstorm";
  else if (condition.includes("mist") || condition.includes("fog")) iconClass = "wi wi-fog";
  weatherIcon.className = iconClass;
}

function setBackground(condition) {
  let bg = "linear-gradient(to right, #74ebd5, #9face6)";
  if (condition.includes("cloud")) bg = "linear-gradient(to right, #bdc3c7, #2c3e50)";
  else if (condition.includes("rain")) bg = "linear-gradient(to right, #4e54c8, #8f94fb)";
  else if (condition.includes("snow")) bg = "linear-gradient(to right, #83a4d4, #b6fbff)";
  else if (condition.includes("clear")) bg = "linear-gradient(to right, #56ccf2, #2f80ed)";
  document.body.style.background = bg;
}

// toggle Celsius / Fahrenheit
toggleUnitBtn.addEventListener("click", () => {
  isCelsius = !isCelsius;
  toggleUnitBtn.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
  if (currentWeather) displayWeather(currentWeather);
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

// search with Enter key
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Detect user location at start
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(pos => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        currentWeather = data;
        displayWeather(data);
      })
      .catch(() => {
        errorMessage.textContent = "Unable to fetch location weather.";
      });
  });
}
