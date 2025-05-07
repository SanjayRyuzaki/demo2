const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
export default async function handler(req, res) {
  const apiKey = process.env.WEATHER_API_KEY;
  console.log("Loaded API KEY:", apiKey);
  const city = req.query.city;

  if (!apiKey) {
    console.error('API key is missing');
    return res.status(500).json({ error: 'API key not set' });
  }

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    res.status(200).json({
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      city: data.name
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

