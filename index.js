// Define OpenWeather API key
const apiKey = '26c399760890f6dbbcf31895ccb4dffe';

// Get the user's location and display the weather on page load
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoordinates(latitude, longitude);
            },
            error => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve location. Please search for a city manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
};

// Get weather using city input or coordinates
function getWeather() {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetchWeatherData(weatherUrl, forecastUrl);
}

// Fetch weather by coordinates
function getWeatherByCoordinates(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetchWeatherData(weatherUrl, forecastUrl);
}

// Fetch weather data and forecast
function fetchWeatherData(weatherUrl, forecastUrl) {
    // Fetch current weather data
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch hourly forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayHourlyForecast(data.list))
        .catch(error => {
            console.error('Error fetching hourly forecast:', error);
            alert('Error fetching hourly forecast. Please try again.');
        });
}

// Display current weather
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404' || data.cod === 404) {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    showImage();
}

// Display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8); // Get the first 8 entries (3-hour intervals)

    hourlyForecastDiv.innerHTML = ''; // Clear previous forecast

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });

    // Hide scrollbar styling
    hourlyForecastDiv.style.overflowY = 'scroll';
    hourlyForecastDiv.style.scrollbarWidth = 'none';
    hourlyForecastDiv.style['-ms-overflow-style'] = 'none';
    hourlyForecastDiv.style['::-webkit-scrollbar'] = 'none';
}

// Show the weather icon
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
