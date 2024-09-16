import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestaurantsService {
  constructor(private readonly configService: ConfigService) {}

  apiKey = this.configService.get('places.apiKey');
  placesApiUrl = this.configService.get('places.apiUrl');
  geoCodingApiUrl = this.configService.get('places.geoCodingApiUrl');

  async getRestaurantsNearCity(city: string) {
    // Call an external API to get the coordinates of a city
    // More info at: https://developers.google.com/maps/documentation/geocoding/requests-geocoding#request
    const queryParameters = new URLSearchParams({
      address: city,
      key: this.apiKey,
    });

    try {
      const response = await axios.get(
        `${this.geoCodingApiUrl}?${queryParameters}`,
      );
      if (!response.data.results.length) {
        throw new BusinessLogicException(
          'City not found',
          BusinessError.NOT_FOUND,
        );
      }
      const { lat, lng } = response.data.results[0].geometry.location;
      return await this.getRestaurantsByCoordinates(lat, lng);
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantsByCoordinates(
    lat: number = 37.7937,
    lon: number = -122.3965,
    radius: number = 500.0,
    maxResultCount: number = 10,
  ) {
    // Call an external API to get restaurants by coordinates
    // More info at: https://developers.google.com/maps/documentation/places/web-service/nearby-search#SearchNearbyRequests
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask': 'places.displayName',
    };

    const body = {
      includedTypes: ['restaurant'],
      maxResultCount: maxResultCount,
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: lon,
          },
          radius: radius,
        },
      },
    };
    try {
      const response = await axios.post(this.placesApiUrl, body, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
