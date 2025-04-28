import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import './weather_card.css';

const Main_card = ({ setCoords }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState('');
  const [icon, setIcon] = useState('');

  const handleSearch = async () => {
    if (!city) return alert("Enter city name");

    try {
      // 1. Get latitude & longitude
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      setCoords({ latitude, longitude });

      // 2. Get weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,weathercode&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      const currentTime = weatherData.current_weather.time;
      const currentHour = currentTime.slice(0, 13); // "YYYY-MM-DDTHH"
      const hourIndex = weatherData.hourly.time.findIndex(t => t.slice(0, 13) === currentHour);

      if (hourIndex === -1) {
        alert("No weather data available for this time");
        return;
      }

      // Format date like "Friday, April 18"
      const now = new Date(currentTime);
      const formattedDate = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      setDate(formattedDate);

      // Get the weather code for icon selection
      const weatherCode = weatherData.hourly.weathercode[hourIndex];
      setIcon(getWeatherIcon(weatherCode));

      // Set weather state
      setWeather({
        city: name,
        country,
        temperature: weatherData.hourly.temperature_2m[hourIndex],
        humidity: weatherData.hourly.relative_humidity_2m[hourIndex],
        wind: weatherData.hourly.wind_speed_10m[hourIndex],
        pressure: weatherData.hourly.pressure_msl[hourIndex],
        description: 'Live Weather',
      });
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const getWeatherIcon = (code) => {
    switch (code) {
      case 0: return '/icons/sun.png';         // Clear sky
      case 1: return '/icons/day_rain.png';    // Partly cloudy
      case 2: return '/icons/day_rain.png';    // Mostly cloudy
      case 3: return '/icons/night_rain.png';  // Overcast
      case 45: return '/icons/night_rain.png'; // Fog
      case 48: return '/icons/night_rain.png'; // Freezing fog
      case 51: return '/icons/day_rain.png';   // Light rain
      case 53: return '/icons/day_rain.png';   // Moderate rain
      case 55: return '/icons/day_rain.png';   // Heavy rain
      case 61: return '/icons/day_rain.png';   // Showers
      case 63: return '/icons/night_rain.png'; // Thunderstorms
      case 65: return '/icons/night_rain.png'; // Heavy thunderstorm
      case 66: return '/icons/night_rain.png'; // Light snow
      case 67: return '/icons/night_rain.png'; // Heavy snow
      case 80: return '/icons/night_rain.png'; // Rain showers
      case 81: return '/icons/day_rain.png';   // Showers of rain
      case 82: return '/icons/day_rain.png';   // Severe showers
      default: return '/icons/sun.png';        // Default icon (Clear Sky)
    }
  };

  return (
    <div className="uter_div">
      <div className="search_box">
        <input
          className="searchbar"
          type="text"
          placeholder="Enter City Name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button id="search_btn" onClick={handleSearch}>
          <BiSearch size={20} />
        </button>
      </div>

      {weather && (
        <div className="weather_result">
          <h2>{weather.city}, {weather.country}</h2>
          <p>{date}</p>
          <img src={icon} alt="Weather Icon" className="weather-icon" />
          <h3>{weather.temperature}°C</h3>
          <p>{weather.description}</p>

          {/* Weather Info Boxes */}
          <div className="weather-info-boxes">
            <div className="info-box">
              <img src="/icons/humidity.png" alt="Humidity Icon" className="info-icon" />
              <p>Humidity: {weather.humidity}%</p>
            </div>
            <div className="info-box">
              <img src="/icons/wind.png" alt="Wind Icon" className="info-icon" />
              <p>Wind: {weather.wind} km/h</p>
            </div>
            <div className="info-box">
              <img src="/icons/pressure.png" alt="Pressure Icon" className="info-icon" />
              <p>Pressure: {weather.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main_card;
