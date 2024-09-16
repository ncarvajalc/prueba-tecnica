import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNearbyRestaurants(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('city') city: string,
  ) {
    if (city) {
      return this.restaurantsService.getRestaurantsNearCity(city);
    }
    return this.restaurantsService.getRestaurantsByCoordinates(lat, lng);
  }
}
