import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler'; 

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addLocation(@Body() body: { city: string }, @Request() req) {
    return this.locationsService.addLocation(body.city, req.user.user_id);
  }

  @Throttle({ default: { limit: 3, ttl: 30000 } }) // override throttle for the specific route
  @Get()
  @UseGuards(JwtAuthGuard)
  async getLocations(@Request() req) {
    return this.locationsService.getFavLocationsForAUser(req.user.user_id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteLocation(@Param('id') id: number, @Request() req) {
    return this.locationsService.deleteLocation(id, req.user.user_id);
  }
}
