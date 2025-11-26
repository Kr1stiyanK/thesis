import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AdminBookings, DataService, ParkingAdmin} from "../../service/data.service";

@Component({
  selector: 'app-allbookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './allbookings.component.html',
  styleUrl: './allbookings.component.css'
})
export class AllbookingsComponent implements OnInit {
  parkings: ParkingAdmin[] = [];
  selectedParkingId: number | null = null;

  bookings: AdminBookings[] = [];
  loading = false;
  error: string | null = null;

  constructor(private ds: DataService) {
  }

  ngOnInit(): void {
    this.ds.getMyParkings().subscribe({
      next: res => this.parkings = res,
      error: err => {
        console.error(err);
        this.error = 'Грешка при зареждане на паркингите.';
      }
    });
  }

  onParkingChange(): void {
    if (!this.selectedParkingId) {
      this.bookings = [];
      return;
    }

    this.loading = true;
    this.error = null;

    this.ds.getAllBookingsForParking(this.selectedParkingId).subscribe({
      next: res => {
        this.bookings = res ?? [];
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Грешка при зареждане на резервациите.';
        this.loading = false;
      }
    });
  }
}
