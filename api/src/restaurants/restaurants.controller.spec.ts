import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

// Mock the JwtAuthGuard to always pass
const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: {
            getRestaurantsNearCity: jest.fn(),
            getRestaurantsByCoordinates: jest.fn(),
          },
        },
        ConfigService,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNearbyRestaurants', () => {
    it('should call getRestaurantsNearCity when city is provided', async () => {
      const mockCity = 'San Francisco';
      const mockRestaurants = { restaurants: ['Restaurant A', 'Restaurant B'] };

      // Mock service method
      (service.getRestaurantsNearCity as jest.Mock).mockResolvedValue(
        mockRestaurants,
      );

      const result = await controller.getNearbyRestaurants(
        null,
        null,
        mockCity,
      );
      expect(service.getRestaurantsNearCity).toHaveBeenCalledWith(mockCity);
      expect(result).toEqual(mockRestaurants);
    });

    it('should call getRestaurantsByCoordinates when city is not provided but lat and lng are', async () => {
      const mockLat = 37.7937;
      const mockLng = -122.3965;
      const mockRestaurants = { restaurants: ['Restaurant C', 'Restaurant D'] };

      // Mock service method
      (service.getRestaurantsByCoordinates as jest.Mock).mockResolvedValue(
        mockRestaurants,
      );

      const result = await controller.getNearbyRestaurants(
        mockLat,
        mockLng,
        null,
      );
      expect(service.getRestaurantsByCoordinates).toHaveBeenCalledWith(
        mockLat,
        mockLng,
      );
      expect(result).toEqual(mockRestaurants);
    });
  });
});
