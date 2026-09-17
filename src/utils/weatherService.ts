import { WeatherDay } from '../types';

export const FALLBACK_WEATHER_DAYS: WeatherDay[] = [
  {
    date: new Date().toISOString().split('T')[0],
    dayName: "Aujourd'hui",
    tempMax: 32,
    tempMin: 21,
    tempCurrent: 29,
    humidityPercent: 48,
    windSpeedKmH: 14,
    solarRadiationMj: 22,
    precipitationMm: 0,
    precipitationProbability: 10,
    condition: 'sunny',
    et0Mm: 5.4,
  },
  {
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dayName: 'Demain',
    tempMax: 33,
    tempMin: 22,
    tempCurrent: 27,
    humidityPercent: 45,
    windSpeedKmH: 16,
    solarRadiationMj: 23,
    precipitationMm: 0,
    precipitationProbability: 15,
    condition: 'sunny',
    et0Mm: 5.8,
  },
  {
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    dayName: 'J+2',
    tempMax: 29,
    tempMin: 21,
    tempCurrent: 26,
    humidityPercent: 72,
    windSpeedKmH: 22,
    solarRadiationMj: 14,
    precipitationMm: 12.5,
    precipitationProbability: 80,
    condition: 'rainy',
    et0Mm: 3.1,
  },
  {
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    dayName: 'J+3',
    tempMax: 27,
    tempMin: 20,
    tempCurrent: 25,
    humidityPercent: 68,
    windSpeedKmH: 12,
    solarRadiationMj: 17,
    precipitationMm: 4.0,
    precipitationProbability: 45,
    condition: 'partly_cloudy',
    et0Mm: 3.9,
  },
  {
    date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    dayName: 'J+4',
    tempMax: 31,
    tempMin: 21,
    tempCurrent: 28,
    humidityPercent: 52,
    windSpeedKmH: 11,
    solarRadiationMj: 21,
    precipitationMm: 0,
    precipitationProbability: 10,
    condition: 'sunny',
    et0Mm: 5.1,
  },
];

export async function fetchLiveWeather(lat: number, lon: number): Promise<{ today: WeatherDay; forecast: WeatherDay[] }> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    
    if (!res.ok) {
      throw new Error(`Météo non disponible (code ${res.status})`);
    }

    const data = await res.json();
    const daily = data.daily;

    if (!daily || !daily.time || daily.time.length === 0) {
      throw new Error('Données météo incomplètes');
    }

    const days: WeatherDay[] = daily.time.slice(0, 5).map((dateStr: string, idx: number) => {
      const code = daily.weathercode ? daily.weathercode[idx] : 0;
      let condition: WeatherDay['condition'] = 'sunny';
      if (code >= 51 && code <= 67) condition = 'rainy';
      else if (code >= 80 && code <= 99) condition = 'stormy';
      else if (code >= 1 && code <= 3) condition = 'partly_cloudy';
      else if (code >= 45) condition = 'cloudy';

      const dateObj = new Date(dateStr);
      let dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' });
      if (idx === 0) dayName = "Aujourd'hui";
      else if (idx === 1) dayName = 'Demain';

      const et0 = daily.et0_fao_evapotranspiration && daily.et0_fao_evapotranspiration[idx] != null
        ? Number(daily.et0_fao_evapotranspiration[idx].toFixed(1))
        : 4.8;

      return {
        date: dateStr,
        dayName,
        tempMax: Math.round(daily.temperature_2m_max[idx] ?? 30),
        tempMin: Math.round(daily.temperature_2m_min[idx] ?? 20),
        tempCurrent: idx === 0 && data.current_weather ? Math.round(data.current_weather.temperature) : Math.round(daily.temperature_2m_max[idx] ?? 28),
        humidityPercent: 55, // Valeur moyenne en journée
        windSpeedKmH: Math.round(daily.windspeed_10m_max ? daily.windspeed_10m_max[idx] : 14),
        solarRadiationMj: Math.round(daily.shortwave_radiation_sum ? daily.shortwave_radiation_sum[idx] : 20),
        precipitationMm: Number((daily.precipitation_sum ? daily.precipitation_sum[idx] : 0).toFixed(1)),
        precipitationProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 10,
        condition,
        et0Mm: et0,
      };
    });

    return {
      today: days[0],
      forecast: days.slice(1),
    };
  } catch (err) {
    console.warn('Utilisation météo locale de secours (Open-Meteo offline ou bloqué):', err);
    return {
      today: FALLBACK_WEATHER_DAYS[0],
      forecast: FALLBACK_WEATHER_DAYS.slice(1),
    };
  }
}
