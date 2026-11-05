import { useEffect, useState } from "react";

export type WeatherCondition =
  | "clear"
  | "cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunder";

export interface Weather {
  condition: WeatherCondition;
  cloudCover: number; // 0–100
  temperature?: number; // °C
  city?: string;
}

// Used when the visitor's approximate location can't be found
const DEFAULT_LOCATION = { city: "Brooklyn", latitude: 40.6782, longitude: -73.9442 };

const CACHE_KEY = "weather";
const CONSENT_KEY = "weatherLocationConsent";
const CACHE_MS = 30 * 60 * 1000; // 30 minutes

const CONDITIONS: WeatherCondition[] = ["clear", "cloudy", "overcast", "fog", "drizzle", "rain", "snow", "thunder"];

// Default cloud cover when previewing a condition via ?weather=
const PREVIEW_CLOUD_COVER: Record<WeatherCondition, number> = {
  clear: 5,
  cloudy: 50,
  overcast: 95,
  fog: 80,
  drizzle: 85,
  rain: 95,
  snow: 90,
  thunder: 100,
};

// WMO weather codes: https://open-meteo.com/en/docs
function conditionFromCode(code: number, cloudCover: number): WeatherCondition {
  if (code >= 95) return "thunder";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code === 45 || code === 48) return "fog";
  if (code === 3 || cloudCover >= 85) return "overcast";
  if (code === 2 || cloudCover >= 30) return "cloudy";
  return "clear";
}

async function getLocation() {
  try {
    const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
    if (!res.ok) throw new Error();
    const data = await res.json();
    const latitude = parseFloat(data.latitude);
    const longitude = parseFloat(data.longitude);
    if (isNaN(latitude) || isNaN(longitude)) throw new Error();
    return { city: data.city as string | undefined, latitude, longitude };
  } catch {
    return DEFAULT_LOCATION;
  }
}

async function fetchWeather(useVisitorLocation: boolean): Promise<Weather> {
  const { city, latitude, longitude } = useVisitorLocation ? await getLocation() : DEFAULT_LOCATION;
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,cloud_cover,temperature_2m`
  );
  if (!res.ok) throw new Error("weather request failed");
  const { current } = await res.json();
  return {
    condition: conditionFromCode(current.weather_code, current.cloud_cover),
    cloudCover: current.cloud_cover,
    temperature: Math.round(current.temperature_2m),
    city,
  };
}

function readCache(key: string): Weather | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { time, weather } = JSON.parse(raw);
    return Date.now() - time < CACHE_MS ? weather : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, weather: Weather) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), weather }));
  } catch {}
}

// Whether the visitor allowed IP-based location: true, false, or null if they haven't chosen yet
export function readLocationConsent(): boolean | null {
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    return saved === null ? null : saved === "true";
  } catch {
    return null;
  }
}

export function saveLocationConsent(allowed: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, String(allowed));
  } catch {}
}

// Returns null until the weather has loaded (or if it fails).
// Only looks up the visitor's location when useVisitorLocation is true; otherwise uses DEFAULT_LOCATION.
// Add ?weather=rain (or any condition) to the URL to preview a condition.
export default function useWeather(useVisitorLocation: boolean): Weather | null {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("weather") as WeatherCondition | null;
    if (preview && CONDITIONS.includes(preview)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWeather({ condition: preview, cloudCover: PREVIEW_CLOUD_COVER[preview] });
      return;
    }

    const cacheKey = `${CACHE_KEY}:${useVisitorLocation ? "visitor" : "default"}`;
    const cached = readCache(cacheKey);
    if (cached) {
      setWeather(cached);
      return;
    }

    let cancelled = false;
    fetchWeather(useVisitorLocation)
      .then((w) => {
        writeCache(cacheKey, w);
        if (!cancelled) setWeather(w);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [useVisitorLocation]);

  return weather;
}
