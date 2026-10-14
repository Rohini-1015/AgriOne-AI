import { dataStore } from './dataStore';

export interface MarketPriceFilter {
  search?: string;
  district?: string;
  state?: string;
  market?: string;
  sortBy?: 'modalPrice' | 'cropName' | 'priceDate';
  order?: 'asc' | 'desc';
}

export class MarketPriceService {
  public static getPrices(filter?: MarketPriceFilter) {
    let list = [...dataStore.marketPrices];

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        item =>
          item.cropName.toLowerCase().includes(q) ||
          (item.cropNameTa && item.cropNameTa.toLowerCase().includes(q)) ||
          item.marketName.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q)
      );
    }

    if (filter?.district) {
      list = list.filter(item => item.district.toLowerCase() === filter.district?.toLowerCase());
    }

    if (filter?.market) {
      list = list.filter(item => item.marketName.toLowerCase().includes(filter.market?.toLowerCase() || ''));
    }

    if (filter?.sortBy) {
      const field = filter.sortBy;
      const factor = filter.order === 'desc' ? -1 : 1;
      list.sort((a, b) => {
        if (a[field] < b[field]) return -1 * factor;
        if (a[field] > b[field]) return 1 * factor;
        return 0;
      });
    }

    return list;
  }

  public static getDistricts(): string[] {
    const set = new Set(dataStore.marketPrices.map(item => item.district));
    return Array.from(set);
  }

  public static getHistoricalTrend(cropName: string, days = 7) {
    const matched = dataStore.marketPrices.find(
      p => p.cropName.toLowerCase().includes(cropName.toLowerCase()) || cropName.toLowerCase().includes(p.cropName.toLowerCase())
    ) || dataStore.marketPrices[0];

    const trends = [];
    const basePrice = matched.modalPrice;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      // Controlled natural fluctuations around base price (+/- 3%)
      const variationFactor = Math.sin(i * 1.5) * 0.04;
      const dayPrice = Math.round(basePrice * (1 + variationFactor));

      trends.push({
        date: d.toISOString().split('T')[0],
        cropName: matched.cropName,
        cropNameTa: matched.cropNameTa,
        modalPrice: dayPrice,
        minPrice: Math.round(dayPrice * 0.92),
        maxPrice: Math.round(dayPrice * 1.08),
        unit: matched.unit,
      });
    }

    return {
      cropName: matched.cropName,
      cropNameTa: matched.cropNameTa,
      marketName: matched.marketName,
      currentPrice: matched.modalPrice,
      trends,
    };
  }
}
