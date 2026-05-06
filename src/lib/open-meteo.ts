export interface WindData {
  timestamp: string;
  windSpeed10m: number; // en m/s
  windGusts10m: number; // en m/s
  windDirection10m: number; // en degrés
  weatherCode: number;
}

export interface HourlyWind {
  hour: string; // ISO timestamp
  windSpeed10m: number;
  windGusts10m: number;
  windDirection10m: number;
}

export interface DailyWind {
  date: string; // YYYY-MM-DD
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface SpotWindForecast {
  current: WindData;
  hourly: HourlyWind[];
  daily: DailyWind[];
}

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";

function weatherCodeToLabel(code: number): string {
  if (code <= 3) return "☀️ Dégagé";
  if (code <= 48) return "🌫️ Brume";
  if (code <= 57) return "🌧️ Bruine";
  if (code <= 67) return "🌧️ Pluie";
  if (code <= 77) return "❄️ Neige";
  if (code <= 82) return "🌧️ Averses";
  if (code <= 86) return "❄️ Neige";
  return "⛈️ Orage";
}

export function weatherCodeToEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "🌤️";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌧️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "❄️";
  return "⛈️";
}

export async function fetchWindForecast(
  lat: number,
  lon: number
): Promise<SpotWindForecast> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code",
    hourly: "wind_speed_10m,wind_gusts_10m,wind_direction_10m",
    daily: "wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant",
    wind_speed_unit: "ms",
    timezone: "Europe/Paris",
    forecast_days: "3",
    models: "icon_seamless",
  });

  const res = await fetch(`${OPEN_METEO_BASE}?${params}`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);

  const data = await res.json();

  const current: WindData = {
    timestamp: data.current.time,
    windSpeed10m: data.current.wind_speed_10m,
    windGusts10m: data.current.wind_gusts_10m,
    windDirection10m: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
  };

  const hourly: HourlyWind[] = data.hourly.time.map(
    (t: string, i: number) => ({
      hour: t,
      windSpeed10m: data.hourly.wind_speed_10m[i],
      windGusts10m: data.hourly.wind_gusts_10m[i],
      windDirection10m: data.hourly.wind_direction_10m[i],
    })
  );

  const daily: DailyWind[] = data.daily.time.map(
    (t: string, i: number) => ({
      date: t,
      windSpeedMax: data.daily.wind_speed_10m_max[i],
      windGustsMax: data.daily.wind_gusts_10m_max[i],
      windDirectionDominant: data.daily.wind_direction_10m_dominant[i],
    })
  );

  return { current, hourly, daily };
}
