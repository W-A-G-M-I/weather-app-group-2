// Defining the getWeather Function
function getWeather() {
    const apiKey = '26c399760890f6dbbcf31895ccb4dffe'; // Open weather app API key
    const city = document.getElementById('city').value // getting the value of city in the input field

    // Alert if the input is empty
    if(!city) {
        alert('Please enter a city')
        return;
    }

    // constructing current weather and forecat based on the entered city and api keys
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;


    // Fetching the current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.')
        });

    //Fetching the hourly forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('error fetching hourly forecast data. Please try again.')
        })
}

    // Defining the displayWeather function 
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div')
    const weatherInfoDiv = document.getElementById('weather-info')
    const weatherIcon = document.getElementById('weather-icon')
    const hourlyForecastDiv = document.getElementById('hourly-forecast')

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    // Checking if the recieved data contains an error code
    if (data.cod === '404' || data.cod === 404) {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`

        // Html content for the temperature 
        const temperatureHTML = `
        <p>${temperature}°C</p>
        `;

        // Html content for the weather descriptions
        const weatherHtml = `
        <p>${cityName}</p>
        <p>${description}</p>
        `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    

    showImage();
  }
}

// Defining the displayHourlyForecast function
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

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
        `;
        
        // Hide the scrollbar
        hourlyForecastDiv.style.overflowY = 'scroll';
        hourlyForecastDiv.style.scrollbarWidth = 'none'; // For Firefox
        hourlyForecastDiv.style['-ms-overflow-style'] = 'none'; // For Internet Explorer and Edge
        hourlyForecastDiv.style['::-webkit-scrollbar'] = 'none'; // For WebKit browsers

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}


function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
