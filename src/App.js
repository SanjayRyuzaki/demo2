import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/weather?city=${city}`);
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
      } else {
        setWeather(null);
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch weather.');
    } finally {
      setLoading(false);
    }
  };

  // Weather background class based on description
  const getWeatherClass = (description = '') => {
    const desc = description.toLowerCase();
    if (desc.includes('cloud')) return 'bg-cloudy';
    if (desc.includes('rain')) return 'bg-rainy';
    if (desc.includes('clear')) return 'bg-sunny';
    if (desc.includes('snow')) return 'bg-snowy';
    return 'bg-default';
  };

  return (
    <div className={`App ${getWeatherClass(weather?.description)}`}>
      <h1>Weather App</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather} disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>{weather.city}</h2>
          <img src={weather.icon} alt={weather.description} />
          <p><strong>Temperature:</strong> {weather.temperature} °C</p>
          <p><strong>Feels Like:</strong> {weather.feels_like} °C</p>
          <p><strong>Humidity:</strong> {weather.humidity} %</p>
          <p><strong>Pressure:</strong> {weather.pressure} hPa</p>
          <p><strong>Wind Speed:</strong> {weather.wind_speed} m/s</p>
          <p><strong>Cloud Coverage:</strong> {weather.clouds} %</p>
          <p><strong>Dew Point:</strong> {weather.dew_point} °C</p>
          <p><strong>Weather:</strong> {weather.description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
