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

  return (
    <div className="App">
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
        <div className="weather-container">
          <div className="weather-info">
            <h2>{weather.city}</h2>
            <img src={weather.current.icon} alt={weather.current.description} />
            <p>{weather.current.temperature} °C</p>
            <p>{weather.current.description}</p>
          </div>

          <div className="weekly-forecast">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
              {weather.daily.map((day) => (
                <div key={day.dt} className="forecast-day">
                  <img src={day.icon} alt={day.description} />
                  <p>{new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                  <p>{day.min}°C / {day.max}°C</p>
                  <p>{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
