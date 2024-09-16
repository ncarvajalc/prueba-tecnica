import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ApiOperation({ summary: 'Get nearby restaurants' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Gets nearby restaurants successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
  })
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
