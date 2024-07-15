document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "6tgoEXefasoYEQGdNzAkOrdYGwCfXMzV"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const dailyDiv = document.getElementById("daily");
    const hourlyDiv = document.getElementById("hourly");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML += `<p>No hourly forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast:", error);
                weatherDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
    const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

    fetch(dailyForecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                displayDailyForecast(data.DailyForecasts);
            } else {
                weatherDiv.innerHTML += `<p>No 5-day forecast available.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching 5-day forecast:", error);
            weatherDiv.innerHTML += `<p>Error fetching 5-day forecast data.</p>`;
        });
}

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
    let forecastContent = `<h2>Hourly Forecast</h2>`;
    data.forEach(hourData => {
        const time = new Date(hourData.DateTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const temperature = hourData.Temperature.Value;
        forecastContent += `
            <p>${time}: ${temperature}°C</p>
        `;
    });
    hourlyDiv.innerHTML += forecastContent;
  }

  function displayDailyForecast(forecasts) {
    let dailyForecastContent = `<h2>Daily Forecast</h2>`;
    forecasts.forEach(forecast => {
        const date = new Date(forecast.Date);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temperatureMin = forecast.Temperature.Minimum.Value;
        const temperatureMax = forecast.Temperature.Maximum.Value;
        dailyForecastContent += `
            <p>${day}: ${temperatureMin}°C - ${temperatureMax}°C</p>
        `;
    });
    dailyDiv.innerHTML += dailyForecastContent;
}
});
