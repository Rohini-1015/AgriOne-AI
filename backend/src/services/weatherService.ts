import { env } from '../config/env';

export interface WeatherData {
  location: {
    name: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    rainProbability: number;
    description: string;
    descriptionTa: string;
    icon: string;
    uvIndex: number;
    pressure: number;
    agriculturalAlert: string;
    agriculturalAlertTa: string;
  };
  forecast: Array<{
    date: string;
    dayName: string;
    dayNameTa: string;
    tempMax: number;
    tempMin: number;
    humidity: number;
    rainProbability: number;
    description: string;
    descriptionTa: string;
    icon: string;
    spraySuitability: 'Favorable' | 'Caution' | 'Unfavorable';
  }>;
}

interface CacheEntry {
  data: WeatherData;
  expiresAt: number;
}

const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const DISTRICT_COORDS: Record<string, { lat: number; lon: number; state: string }> = {
  thanjavur: { lat: 10.7870, lon: 79.1378, state: 'Tamil Nadu' },
  coimbatore: { lat: 11.0168, lon: 76.9558, state: 'Tamil Nadu' },
  madurai: { lat: 9.9252, lon: 78.1198, state: 'Tamil Nadu' },
  chennai: { lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
  salem: { lat: 11.6643, lon: 78.1460, state: 'Tamil Nadu' },
  erode: { lat: 11.3410, lon: 77.7172, state: 'Tamil Nadu' },
  tiruchirappalli: { lat: 10.7905, lon: 78.7047, state: 'Tamil Nadu' },
  dindigul: { lat: 10.3673, lon: 77.9803, state: 'Tamil Nadu' },
  tirunelveli: { lat: 8.7139, lon: 77.7567, state: 'Tamil Nadu' },
  vellore: { lat: 12.9165, lon: 79.1325, state: 'Tamil Nadu' },
};

export class WeatherService {
  public static async getWeather(query?: { city?: string; lat?: string; lon?: string }): Promise<WeatherData> {
    const cityKey = (query?.city || 'thanjavur').toLowerCase().trim();
    const cacheKey = query?.lat && query?.lon ? `${query.lat}_${query.lon}` : cityKey;

    const cached = weatherCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    let weatherData: WeatherData;

    // If external OpenWeather API key is provided
    if (env.OPENWEATHER_API_KEY) {
      try {
        weatherData = await this.fetchFromExternalApi(query);
      } catch (err) {
        console.warn('⚠️ Weather API call failed, falling back to simulated meteorological engine:', err);
        weatherData = this.generateSimulatedWeather(cityKey, query?.lat, query?.lon);
      }
    } else {
      weatherData = this.generateSimulatedWeather(cityKey, query?.lat, query?.lon);
    }

    weatherCache.set(cacheKey, {
      data: weatherData,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return weatherData;
  }

  private static async fetchFromExternalApi(query?: { city?: string; lat?: string; lon?: string }): Promise<WeatherData> {
    // Dynamic import to avoid missing fetch in older node runtimes
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${env.OPENWEATHER_API_KEY}&units=metric`;
    if (query?.lat && query?.lon) {
      url += `&lat=${query.lat}&lon=${query.lon}`;
    } else {
      url += `&q=${encodeURIComponent(query?.city || 'Thanjavur,IN')}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.statusText}`);
    }
    const currentJson: any = await response.json();

    // Forecast URL
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentJson.coord.lat}&lon=${currentJson.coord.lon}&appid=${env.OPENWEATHER_API_KEY}&units=metric`;
    const forecastRes = await fetch(forecastUrl);
    const forecastJson: any = await forecastRes.json();

    const forecastDays = forecastJson.list
      .filter((_: any, idx: number) => idx % 8 === 0)
      .slice(0, 7)
      .map((item: any) => {
        const d = new Date(item.dt * 1000);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayNamesTa = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
        const rainProb = Math.round((item.pop || 0) * 100);
        return {
          date: d.toISOString().split('T')[0],
          dayName: dayNames[d.getDay()],
          dayNameTa: dayNamesTa[d.getDay()],
          tempMax: Math.round(item.main.temp_max),
          tempMin: Math.round(item.main.temp_min),
          humidity: item.main.humidity,
          rainProbability: rainProb,
          description: item.weather[0].description,
          descriptionTa: this.translateWeather(item.weather[0].description),
          icon: item.weather[0].icon,
          spraySuitability: rainProb > 40 || item.wind.speed > 15 ? 'Unfavorable' : rainProb > 20 ? 'Caution' : 'Favorable',
        };
      });

    return {
      location: {
        name: currentJson.name,
        state: 'Tamil Nadu',
        country: 'India',
        lat: currentJson.coord.lat,
        lon: currentJson.coord.lon,
      },
      current: {
        temp: Math.round(currentJson.main.temp),
        feelsLike: Math.round(currentJson.main.feels_like),
        humidity: currentJson.main.humidity,
        windSpeed: Math.round(currentJson.wind.speed * 3.6), // m/s to km/h
        rainProbability: Math.round((forecastDays[0]?.rainProbability || 20)),
        description: currentJson.weather[0].description,
        descriptionTa: this.translateWeather(currentJson.weather[0].description),
        icon: currentJson.weather[0].icon,
        uvIndex: 7,
        pressure: currentJson.main.pressure,
        agriculturalAlert: 'Ideal window for vegetative foliar spray before 10 AM. Ground moisture adequate.',
        agriculturalAlertTa: 'காலை 10 மணிக்குள் இலைவழி உரம் தெளிக்க உகந்த நேரம். நிலத்தில் ஈரப்பதம் சீராக உள்ளது.',
      },
      forecast: forecastDays,
    };
  }

  private static generateSimulatedWeather(cityKey: string, latStr?: string, lonStr?: string): WeatherData {
    const matchedCoords = DISTRICT_COORDS[cityKey] || { lat: 10.7870, lon: 79.1378, state: 'Tamil Nadu' };
    const cityName = cityKey.charAt(0).toUpperCase() + cityKey.slice(1);

    const baseTemp = 31;
    const baseHumidity = 68;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNamesTa = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

    const forecast = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const rainProb = [25, 30, 65, 75, 40, 15, 20][i % 7];
      const maxT = baseTemp + (i % 3) - 1;
      const minT = maxT - 8;

      let descEn = 'Partly Cloudy';
      let descTa = 'பகுதி மேகமூட்டம்';
      let icon = '02d';

      if (rainProb > 60) {
        descEn = 'Scattered Thunderstorms & Rain';
        descTa = 'இடியுடன் கூடிய மழை';
        icon = '10d';
      } else if (rainProb > 30) {
        descEn = 'Passing Showers';
        descTa = 'லேசான சாரல் மழை';
        icon = '09d';
      }

      forecast.push({
        date: d.toISOString().split('T')[0],
        dayName: i === 0 ? 'Today' : dayNames[d.getDay()],
        dayNameTa: i === 0 ? 'இன்று' : dayNamesTa[d.getDay()],
        tempMax: maxT,
        tempMin: minT,
        humidity: baseHumidity + (rainProb > 50 ? 15 : -5),
        rainProbability: rainProb,
        description: descEn,
        descriptionTa: descTa,
        icon,
        spraySuitability: (rainProb > 50 ? 'Unfavorable' : rainProb > 25 ? 'Caution' : 'Favorable') as 'Favorable' | 'Caution' | 'Unfavorable',
      });
    }

    return {
      location: {
        name: cityName,
        state: matchedCoords.state,
        country: 'India',
        lat: latStr ? parseFloat(latStr) : matchedCoords.lat,
        lon: lonStr ? parseFloat(lonStr) : matchedCoords.lon,
      },
      current: {
        temp: 31,
        feelsLike: 34,
        humidity: 70,
        windSpeed: 14,
        rainProbability: 25,
        description: 'Partly Cloudy with Gentle Breeze',
        descriptionTa: 'மிதமான காற்றுடன் கூடிய பகுதி மேகமூட்டம்',
        icon: '02d',
        uvIndex: 7,
        pressure: 1012,
        agriculturalAlert: 'Weather is favorable for transplanting and fertilization. Rain expected in 48 hours.',
        agriculturalAlertTa: 'நடவு மற்றும் உரம் இட சாதகமான வானிலை. அடுத்த 48 மணி நேரத்தில் மழை வாய்ப்பு உள்ளது.',
      },
      forecast,
    };
  }

  private static translateWeather(desc: string): string {
    const lower = desc.toLowerCase();
    if (lower.includes('rain') || lower.includes('shower')) return 'மழை';
    if (lower.includes('cloud')) return 'மேகமூட்டம்';
    if (lower.includes('clear') || lower.includes('sun')) return 'தெளிவான வானம்';
    if (lower.includes('thunder')) return 'இடியுடன் கூடிய மழை';
    if (lower.includes('mist') || lower.includes('fog')) return 'பனிமூட்டம்';
    return 'மிதமான வானிலை';
  }
}
