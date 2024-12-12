import { Injectable, ConflictException, InternalServerErrorException, BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async addLocation(city: string, userId: string): Promise<Location> {
    const location = new Location();
    location.city = city;
    location.user_id = userId;
    try {
      // Check if the location already exists
      const existingLocation = await this.locationsRepository.findOne({ where: { user_id: userId, city } });
      
      if (existingLocation) {
        throw new ConflictException('This location is already in your favorites!');
      }
      return this.locationsRepository.save(location);
    } catch(error) {
      if (error.status === 409) {
        throw new ConflictException('This location is already in your favorites');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  async getFavLocationsForAUser(userId: string): Promise<Location[]> {
    return this.locationsRepository.find({ where: { user_id: userId } });
  }

  async deleteLocation(id: number, userId: string): Promise<void> {
    try {
      const location = await this.locationsRepository.findOne({ where: { id, user_id: userId } });
      if(location !== null) {
        await this.locationsRepository.delete(id);
      } else {
        throw new NotFoundException('Location not found');
      }
    } catch(error) {
      if (error.status === 404) {
        throw new HttpException('Location id not found for this user', 404);
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
}
