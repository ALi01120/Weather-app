import { useState } from 'react';
import './App.css';
import Main_card from './assets/weather_card';
import HourlyWeather from './assets/hourly_Weather';

function App() {
  const [coords, setCoords] = useState(null); // shared state for latitude and longitude

  return (
    <>
      <Main_card setCoords={setCoords} />
      {coords && <HourlyWeather latitude={coords.latitude} longitude={coords.longitude} />}
    </>
  );
}

export default App;
