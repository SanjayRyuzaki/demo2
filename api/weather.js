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
    // STEP 1: Get coordinates
    const geoRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();
    console.log('GeoData:', geoData);

    if (!geoData.length) {
      console.log('City not found in geolocation API');
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon, name } = geoData[0];

    // STEP 2: Get weather using One Call 3.0 API
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`
    );
    
    const weatherData = await weatherRes.json();
    console.log('WeatherData:', weatherData);

    if (!weatherData || !weatherData.current || !weatherData.daily) {
      console.log('Weather API response missing expected data structure');
      return res.status(500).json({ error: 'Invalid weather data received' });
    }

    // Successful response
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
    console.error('Caught error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
