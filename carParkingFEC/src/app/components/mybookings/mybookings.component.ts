import {Component, OnInit} from '@angular/core';
import {DataService} from "../../service/data.service";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-mybookings',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './mybookings.component.html',
  styleUrl: './mybookings.component.css'
})
export class MybookingsComponent implements OnInit {
  bookings: Booking[] = [];
  currentPage: number = 1;
  pageSize: number = 8;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const email = this.dataService.getCurrentUser();
    if (!email) {
      this.bookings = [];
      return;
    }

    this.dataService.getMyBookings(email).subscribe(data => {
      this.bookings = data ?? [];
    });
  }

  get paginatedBookings(): Booking[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.bookings.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.bookings.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}

export interface Booking {
  id: number;
  parkingName: string;
  spaceNumber: number;
  startTime: string;
  endTime: string;
  amountBgn: number | null;
}

