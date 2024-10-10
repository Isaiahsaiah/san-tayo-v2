import { Component, inject, input, output } from '@angular/core';
import { Restaurant } from '../restaurant/restaurant.model';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent {
  restaurant = input.required<Restaurant | null>();
  origin = input.required<{ latitude: number; longitude: number }>();
  reset = output();

  onReset() {
    this.reset.emit();
  }

  getDirections() {
    // console.log('Getting directions...');
    const originLat = this.origin().latitude.toString();
    const originLong = this.origin().longitude.toString();
    // console.log(originLat, originLong);
    const destinationLat = this.restaurant()?.lat?.toString();
    const destinationLong = this.restaurant()?.long?.toString();
    // console.log(destinationLat, destinationLong);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLong}&destination=${destinationLat},${destinationLong}`;

    window.open(url, '_blank');
  }
}
