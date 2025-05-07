const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function calculateDewPoint(tempC, humidity) {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
}

export default async function handler(req, res) {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = req.query.city;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set' });
  }

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    const dewPoint = calculateDewPoint(data.main.temp, data.main.humidity);

    res.status(200).json({
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      clouds: data.clouds.all,
      dew_point: dewPoint.toFixed(2),
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      city: data.name
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
