import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'places.apiKey':
                  return 'test-api-key';
                case 'places.apiUrl':
                  return 'https://mock-places-api.com';
                case 'places.geoCodingApiUrl':
                  return 'https://mock-geocoding-api.com';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRestaurantsNearCity', () => {
    it('should return restaurants when the city is found', async () => {
      // Mock the axios response for the geocoding API
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          results: [
            {
              geometry: {
                location: { lat: 37.7937, lng: -122.3965 },
              },
            },
          ],
        },
      });

      // Mock the axios response for the places API
      mockedAxios.post.mockResolvedValueOnce({
        data: { restaurants: ['Restaurant A', 'Restaurant B'] },
      });

      const result = await service.getRestaurantsNearCity('San Francisco');
      expect(result).toEqual({ restaurants: ['Restaurant A', 'Restaurant B'] });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://mock-places-api.com',
        {
          includedTypes: ['restaurant'],
          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: { latitude: 37.7937, longitude: -122.3965 },
              radius: 500.0,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'test-api-key',
            'X-Goog-FieldMask': 'places.displayName',
          },
        },
      );
    });

    it('should throw a BusinessLogicException when the city is not found', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          results: [],
        },
      });

      await expect(
        service.getRestaurantsNearCity('Unknown City'),
      ).rejects.toThrow(
        new BusinessLogicException('City not found', BusinessError.NOT_FOUND),
      );
    });

    it('should propagate any errors thrown by axios', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(
        service.getRestaurantsNearCity('San Francisco'),
      ).rejects.toThrow(error);
    });
  });

  describe('getRestaurantsByCoordinates', () => {
    it('should return restaurants when given valid coordinates', async () => {
      // Mock the axios response for the places API
      mockedAxios.post.mockResolvedValueOnce({
        data: { restaurants: ['Restaurant A', 'Restaurant B'] },
      });

      const result = await service.getRestaurantsByCoordinates(
        37.7937,
        -122.3965,
      );
      expect(result).toEqual({ restaurants: ['Restaurant A', 'Restaurant B'] });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://mock-places-api.com',
        {
          includedTypes: ['restaurant'],
          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: { latitude: 37.7937, longitude: -122.3965 },
              radius: 500.0,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'test-api-key',
            'X-Goog-FieldMask': 'places.displayName',
          },
        },
      );
    });

    it('should propagate any errors thrown by axios in getRestaurantsByCoordinates', async () => {
      const error = new Error('API error');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(
        service.getRestaurantsByCoordinates(37.7937, -122.3965),
      ).rejects.toThrow(error);
    });
  });
});
