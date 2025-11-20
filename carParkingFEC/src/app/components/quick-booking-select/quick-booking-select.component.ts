import {Component, OnInit} from '@angular/core';
import {ParkingHome} from "../home/home.component";
import {DataService} from "../../service/data.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-quick-booking-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-booking-select.component.html',
  styleUrl: './quick-booking-select.component.css'
})
export class QuickBookingSelectComponent implements OnInit {

  parkings: ParkingHome[] = [];
  selectedParkingId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private ds: DataService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadParkings();
  }

  private loadParkings(): void {
    this.loading = true;
    this.ds.getParkingsForHome().subscribe({
      next: data => {
        this.parkings = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading parkings', err);
        this.error = 'Грешка при зареждане на паркингите.';
        this.loading = false;
      }
    });
  }

  onParkingChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedParkingId = Number(select.value);
  }


  goNext(): void {
    if (!this.selectedParkingId) {
      return;
    }

    this.router.navigate(
      ['/quick-booking'],
      {queryParams: {parkingId: this.selectedParkingId}}
    );
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  protected readonly HTMLSelectElement = HTMLSelectElement;
}
