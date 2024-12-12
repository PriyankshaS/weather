import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from './location.entity';

describe('LocationService', () => {
  let service: LocationsService;
  let locationsRepository: Repository<Location>;

  const mockLocationsRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationsRepository,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    locationsRepository = module.get<Repository<Location>>(getRepositoryToken(Location));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addLocation', () => {
    it('should successfully add a location if it does not exist', async () => {
      const userId = 'user123';
      const city = 'London';

      // Mock the repository method to return null (location doesn't exist)
      mockLocationsRepository.findOne.mockResolvedValue(null);
      mockLocationsRepository.save.mockResolvedValue({ city, user_id: userId });

      const result = await service.addLocation(city, userId);

      expect(result).toEqual({ city, user_id: userId });
      expect(mockLocationsRepository.save).toHaveBeenCalledWith({ city, user_id: userId });
    });

    it('should throw ConflictException if the location already exists', async () => {
      const userId = '1';
      const city = 'Lko';

      // Mock the repository method to return an existing location
      mockLocationsRepository.findOne.mockResolvedValue({ city, user_id: userId });

      try {
        await service.addLocation(city, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('This location is already in your favorites');
      }

      expect(mockLocationsRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: userId, city },
      });
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const userId = '1';
      const city = 'Pune';

      // Mock the repository to throw an unexpected error
      mockLocationsRepository.findOne.mockRejectedValue(new Error('Database error'));

      try {
        await service.addLocation(city, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('An unexpected error occurred');
      }

      expect(mockLocationsRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: userId, city },
      });
    });
  });
});
