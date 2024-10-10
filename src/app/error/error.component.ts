import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../restaurant/restaurant.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  private router = inject(Router);
  private restaurantService = inject(RestaurantService);
  errorMessage = this.restaurantService.locationErrorMessage();

  goHome() {
    this.router.navigate(['/']);
  }
}
