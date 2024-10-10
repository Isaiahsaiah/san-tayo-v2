import { Component, inject, signal } from '@angular/core';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/restaurant.model';
import { map } from 'rxjs';
import { ResultComponent } from '../result/result.component';
import { LoadingComponent } from '../loading/loading.component';
import { Router } from '@angular/router';
import { version } from '../../../package.json';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ResultComponent, LoadingComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private router = inject(Router);
  private restaurantService = inject(RestaurantService);
  restaurants = this.restaurantService.restaurants;

  version = version;

  randomRestaurant = signal<Restaurant | null>(null);
  isLoading = signal(false);
  originLocation = signal<any>({});

  generateRandomRestaurant(restaurants: Restaurant[]) {
    this.isLoading.set(true);
    const restaurantId = this.generateRandomId(restaurants);
    const filteredRestaurant = restaurants.filter(
      (restaurant) => restaurant.id === restaurantId
    );
    this.randomRestaurant.set(filteredRestaurant[0]);
    // console.log(this.randomRestaurant());
    this.isLoading.set(false);
  }

  generateRandomRestaurantNearMe() {
    this.isLoading.set(true);

    // get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.originLocation.set(userLocation);

        // search nearby restaurants
        this.restaurantService
          .searchNearbyRestaurants(
            userLocation.latitude,
            userLocation.longitude
          )
          .pipe(map((resData) => resData.places)) // response data
          .subscribe({
            next: (places) => {
              // console.log('PLACES RESPONSE', places);
              const fetchedPlaces = places; // store the response to fetchedPlaces

              let nearbyRestaurants: Restaurant[] = [];
              let i = 0;
              // build the array
              fetchedPlaces.forEach((place: any) => {
                nearbyRestaurants.push({
                  id: (i + 1).toString(),
                  name: place.displayName.text,
                  url: '',
                  lat: place.location.latitude,
                  long: place.location.longitude,
                });
                i++;
              });
              // console.log(nearbyRestaurants);

              // final
              this.generateRandomRestaurant(nearbyRestaurants);
            },
            error: (error) => {
              console.log(
                'Error occured in fetching nearby restaurants',
                error
              );
              const errorMessage = error.message;
              this.restaurantService.setLocErrMessage(errorMessage);
              this.router.navigate(['/error']);
            },
            complete: () => {
              // console.log('Request Completed!');
              this.isLoading.set(false);
            },
          });
      },
      (error) => {
        const errorMessage = `Unable to get current location: ${error.message}`;
        this.restaurantService.setLocErrMessage(errorMessage);
        this.isLoading.set(false);
        this.router.navigate(['/error']);
      }
    );
  }

  private generateRandomId(restaurants: any[]): string {
    const id = Math.trunc(Math.random() * restaurants.length + 1);
    return id.toString();
  }

  onReset() {
    this.randomRestaurant.set(null);
  }
}
