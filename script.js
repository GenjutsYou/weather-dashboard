const API_KEY = '6bfb621281c583496216186a1cf5df50';
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchHistoryContainer = document.querySelector('#search-history-container');
const searchHistory = document.querySelector('#search-history');
const currentWeather = document.querySelector('#current-weather');
const forecast = document.querySelector('#forecast');
const mainSection = document.querySelector('main');

let searchHistoryArray = [];

mainSection.style.display = 'none';

function getWeather(city) {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  Promise.all([fetch(currentWeatherURL), fetch(forecastURL)])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
      const currentWeatherData = data[0];
      const forecastData = data[1];

      // Update current weather
      const cityName = currentWeatherData.name;
      const date = new Date(currentWeatherData.dt * 1000).toLocaleDateString();
      const iconCode = currentWeatherData.weather[0].icon;
      const iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;
      const temperatureCelsius = Math.round(currentWeatherData.main.temp);
      const temperatureFahrenheit = Math.round((temperatureCelsius * 9/5) + 32);
      const humidity = currentWeatherData.main.humidity;
      const windSpeed = Math.round(currentWeatherData.wind.speed);

      currentWeather.innerHTML = `
        <div class="weather-item">
        <div id="city-name">${cityName} (${date}) <img src="${iconURL}" alt="${currentWeatherData.weather[0].description}" /></div>
        <div class="weather-reading">
        <p>Temperature: ${temperatureCelsius} &deg;C / ${temperatureFahrenheit} &deg;F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} km/h</p>
        </div>
        </div>
      `;

      // Update forecast
      let forecastHTML = '';

      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const iconCode = item.weather[0].icon;
        const iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;
        const temperatureCelsius = Math.round(item.main.temp);
        const temperatureFahrenheit = Math.round((temperatureCelsius * 9/5) + 32);
        const humidity = item.main.humidity;
        const windSpeed = Math.round(item.wind.speed);

        if (item.dt_txt.includes('12:00:00')) {
          forecastHTML += `
            <div class="forecast-item">
            <div class="forecast-date">
              <p><strong>${date}</strong></p>
              <img src="${iconURL}" alt="${item.weather[0].description}" />
            </div>
            <div class="forecast-reading">
              <p>Temp: ${temperatureCelsius} &deg;C / ${temperatureFahrenheit} &deg;F</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind: ${windSpeed} km/h</p>
            </div>
            </div>
          `;
        }
      });

      forecast.innerHTML = forecastHTML;
    })
    .catch(() => {
      currentWeather.innerHTML = '<p>Unable to retrieve weather data</p>';
      forecast.innerHTML = '';
    });
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city) {
    getWeather(city);
    if (!searchHistoryArray.includes(city)) {
      searchHistoryArray.push(city);
      const searchHistoryItem = document.createElement('div');
      searchHistoryItem.textContent = city;
      searchHistory.appendChild(searchHistoryItem);
    }
    searchInput.value = '';
    mainSection.style.display = 'block';
  }
});

searchHistory.addEventListener('click', e => {
  const city = e.target.textContent;
  getWeather(city);
});
