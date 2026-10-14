import { Request, Response, NextFunction } from 'express';
import { MarketPriceService } from '../services/marketPriceService';

export class MarketController {
  public static async getPrices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, district, market, sortBy, order } = req.query as any;

      const prices = MarketPriceService.getPrices({
        search,
        district,
        market,
        sortBy,
        order,
      });

      const districts = MarketPriceService.getDistricts();

      res.status(200).json({
        success: true,
        data: {
          prices,
          districts,
          total: prices.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getTrend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cropName = String(req.params.cropName);
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
      const trendData = MarketPriceService.getHistoricalTrend(cropName, days);

      res.status(200).json({
        success: true,
        data: trendData,
      });
    } catch (error) {
      next(error);
    }
  }
}
