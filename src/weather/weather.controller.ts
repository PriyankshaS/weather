import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  async getCurrentWeather(@Param('city') city: string) {
    return this.weatherService.getCurrentWeather(city);
  }

  @Get('forecast/:city')
  async getForecast(@Param('city') city: string) {
    return this.weatherService.getForecast(city);
  }
}
