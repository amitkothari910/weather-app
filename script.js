const apiKey = "58baa5ae77531660e5c93be482641cab";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".city").innerHTML = "City not found";
        document.querySelector(".temp").innerHTML = "";
        document.querySelector(".humidity").innerHTML = "";
        document.querySelector(".wind").innerHTML = "";
        weatherIcon.src = "";
    } else {
        var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "https://img.icons8.com/ios-filled/100/000000/cloud.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "https://img.icons8.com/ios-filled/100/000000/sun.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "https://img.icons8.com/ios-filled/100/000000/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "https://img.icons8.com/ios-filled/100/000000/light-rain.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "https://img.icons8.com/ios-filled/100/000000/fog-day.png";
        }
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
