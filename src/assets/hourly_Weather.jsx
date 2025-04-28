import { useEffect, useState } from 'react';
import './hourly_weather.css';

const HourlyWeather = ({ latitude, longitude }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=auto`
        );
        const data = await res.json();

        console.log(data); // Log response to inspect structure
        
        if (data && data.hourly) {
          const hours = data.hourly.time.slice(0, 24);
          const temps = data.hourly.temperature_2m.slice(0, 24);

          const formatted = hours.map((time, i) => {
            const date = new Date(time);
            const hour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              time: hour,
              temp: temps[i],
              rawTime: date,
            };
          });

          setHourlyData(formatted);
        } else {
          console.error('Invalid API response or data missing');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const getIcon = (date, temp) => {
    const hour = date.getHours();
    const isNight = hour < 6 || hour >= 18;
    const isRainy = temp < 25;

    if (isNight && isRainy) return '/icons/night_rain.png';
    if (!isNight && isRainy) return '/icons/day_rain.png';
    if (isNight) return '/icons/moon.png';
    return '/icons/sun.png';
  };

  return (
    <div className="hourly-container">
      {hourlyData.map((item, i) => (
        <div className="hour-box" key={i}>
          <img src={getIcon(item.rawTime, item.temp)} alt="icon" className="weather-icon" />
          <div className="temp">{item.temp}°C</div>
          <div className="time">{item.time}</div>
        </div>
      ))}
    </div>
  );
};

export default HourlyWeather;
