import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;
  let cacheManager: Cache;
  let configService: ConfigService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: 'CACHE_MANAGER', useValue: mockCacheManager },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>('CACHE_MANAGER');
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentWeather', () => {
    it('should return weather data successfully', async () => {
      const city = 'London';
      const mockResponse = { data: { city, temperature: 20 } };

      // Mock ConfigService to return appropriate values
      mockConfigService.get.mockReturnValueOnce('http://api.weatherapi.com/v1').mockReturnValueOnce('dummy-api-key');

      // Mock HTTP GET call to return the mock response
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getCurrentWeather(city);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
