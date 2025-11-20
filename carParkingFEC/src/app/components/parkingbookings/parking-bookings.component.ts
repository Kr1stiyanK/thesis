import { Component } from '@angular/core';

@Component({
  selector: 'app-parkingbookings',
  standalone: true,
  imports: [],
  templateUrl: './parking-bookings.component.html',
  styleUrl: './parking-bookings.component.css'
})
export class ParkingBookingsComponent {
  // myParkings: ParkingSummary[] = [];
  // bookings: ParkingBookingForAdmin[] = [];

  selectedParkingId: number | null = null;
  loading = false;
  error?: string;

}
