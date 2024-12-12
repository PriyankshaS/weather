import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject('CACHE_MANAGER')private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('WEATHER_API_KEY');
    this.apiUrl = this.configService.get<string>('WEATHER_API_URL');
  }

  async getCurrentWeather(city: string): Promise<any> {
    const url = `${this.apiUrl}/current.json?key=${this.apiKey}&q=${city}`;
    try {
      const response: any = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching weather for city ${city}`, error.stack);
      throw error;
    }
  }

  async getForecast(city: string): Promise<any> {
    const cacheKey = `forecast:${city}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const url = `${this.apiUrl}/forecast.json?key=${this.apiKey}&q=${city}&days=5`;
    try {
      const response: any = await firstValueFrom(this.httpService.get(url));
      const ttlCache = parseInt(this.configService.get<string>('CACHE_TTL'));
      await this.cacheManager.set(cacheKey, response.data, ttlCache);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching forecast for city ${city}`, error.stack);
      throw error;
    }
  }
}
