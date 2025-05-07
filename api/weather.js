const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = req.query.city;

  if (!apiKey) {
    console.error('API key is missing');
    return res.status(500).json({ error: 'API key not set' });
  }

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // Step 1: Get coordinates using Geo API
    const geoRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();
    console.log('GeoData:', geoData);

    if (!geoData.length) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon, name } = geoData[0];

    // Step 2: Fetch weather using One Call API
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
    console.log('Fetching weather from:', weatherUrl);

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    console.log('WeatherData:', weatherData);

    if (weatherData.cod && weatherData.cod !== 200) {
      throw new Error(weatherData.message || 'Weather API error');
    }

    res.status(200).json({
      city: name,
      current: {
        temperature: weatherData.current.temp,
        description: weatherData.current.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`,
      },
      daily: weatherData.daily.slice(1, 6).map((day) => ({
        dt: day.dt,
        min: day.temp.min,
        max: day.temp.max,
        description: day.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
      })),
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
