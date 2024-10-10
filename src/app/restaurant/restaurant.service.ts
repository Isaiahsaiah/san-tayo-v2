import { inject, Injectable, signal } from '@angular/core';
import { DUMMY_RESTAURANTS } from './dummy-restaurant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = 'https://places.googleapis.com/v1/places:searchNearby';
  private http = inject(HttpClient);

  locationErrorMessage = signal<string>('');

  get restaurants() {
    return DUMMY_RESTAURANTS;
  }

  searchNearbyRestaurants(latitude: number, longitude: number) {
    const payload = {
      includedTypes: ['restaurant'],
      // maxResultCount: 10, // max 20
      locationRestriction: {
        circle: {
          center: {
            latitude: latitude,
            longitude: longitude,
          },
          radius: 1000.0,
        },
      },
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': environment.googleMapsApiKey,
      'X-Goog-FieldMask': 'places.displayName,places.location',
    });

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }

  setLocErrMessage(message: string) {
    this.locationErrorMessage.set(message);
    // console.log(this.locationErrorMessage());
  }
}
