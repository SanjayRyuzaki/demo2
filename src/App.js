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

  const toggleTheme = () => {
    document.body.classList.toggle('dark');
  };

  const getWeatherIconClass = (weatherId) => {
    // You might need to adjust this based on your API's weatherId
    return `wi wi-owm-${weatherId}`;
  };

  return (
    <div className="App">
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
        🌙 / ☀️
      </button>

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
          <i className={getWeatherIconClass(weather.weather_id)}></i>
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
