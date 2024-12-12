import { Injectable } from '@nestjs/common';
// import { CacheService } from '@nestjs/cache-manager';

@Injectable()
export class WeatherCacheService {
  // constructor(private readonly cacheService: CacheService) {}

  async getWeatherCache(city: string): Promise<any> {
    // return await this.cacheService.get(city);
  }

  async setWeatherCache(city: string, data: any): Promise<void> {
    // await this.cacheService.set(city, data, { ttl: 3600 });
  }
}
