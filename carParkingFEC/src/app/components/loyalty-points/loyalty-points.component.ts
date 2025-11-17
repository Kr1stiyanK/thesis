import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataService, LoyaltySummary} from '../../service/data.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-loyalty-points',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loyalty-points.component.html',
  styleUrl: './loyalty-points.component.css'
})
export class LoyaltyPointsComponent implements OnInit {

  all: LoyaltySummary[] = [];
  selectedParkingId: number | null = null;
  selected: LoyaltySummary | null = null;

  constructor(private ds: DataService) {}

  ngOnInit(): void {
    this.ds.getMyLoyalty().subscribe({
      next: res => {
        this.all = res;
        if (res.length > 0) {
          this.onSelect(res[0].parkingId);
        }
      },
      error: err => console.error(err)
    });
  }

  onSelect(parkingId: number) {
    this.selectedParkingId = parkingId;
    this.selected = this.all.find(p => p.parkingId === parkingId) || null;
  }
}
