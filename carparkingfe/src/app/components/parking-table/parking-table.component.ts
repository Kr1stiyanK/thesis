import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import {JwtService} from "../../services/jwt.service";

@Component({
  selector: 'app-parking-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatDialogModule],
  templateUrl: './parking-table.component.html',
  styleUrls: ['./parking-table.component.css']
})
export class ParkingTableComponent implements OnInit {
  parkingSpaces: any[] = [];
  displayedColumns: string[] = ['space', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  constructor(private parkingService: JwtService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.parkingService.getParkingSpaces().subscribe((data) => {
      this.parkingSpaces = data;
    });
  }

  openBookingDialog(space: any, time: string): void {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '300px',
      data: { space, time }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.parkingService.bookParkingSpace(result).subscribe(() => {
          // Обновяване на данните след успешна резервация
          this.parkingService.getParkingSpaces().subscribe((data) => {
            this.parkingSpaces = data;
          });
        });
      }
    });
  }
}
