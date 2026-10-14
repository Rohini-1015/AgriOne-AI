import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weatherService';

export class WeatherController {
  public static async getWeather(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { city, lat, lon } = req.query as { city?: string; lat?: string; lon?: string };
      const weatherData = await WeatherService.getWeather({ city, lat, lon });

      res.status(200).json({
        success: true,
        data: weatherData,
      });
    } catch (error) {
      next(error);
    }
  }
}
