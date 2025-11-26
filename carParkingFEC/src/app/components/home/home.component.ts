import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Subscription, switchMap, timer} from "rxjs";
import {DataService} from "../../service/data.service";
import {ParkingListComponent} from "../parking-list/parking-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, ParkingListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  private sub?: Subscription;
  parkings: ParkingHome[] = [];


  constructor(private service: DataService, private router: Router) {
  }

  ngOnInit() {
    this.loadParkings();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private loadParkings(): void {
    this.sub = timer(0, 15000).pipe(
      switchMap(() => this.service.getParkingsForHome())
    ).subscribe({
      next: data => this.parkings = data,
      error: err => console.error('Грешка при зареждане на паркингите', err)
    });
  }


}

export interface ParkingHome {
  id: number;
  name: string;
  city?: string;
  address: string;
  spacesCount: number;
  freeSpaces: number;
  pricePerHourBgn: number;
  cardPaymentEnabled: boolean;
  loyaltyEnabled: boolean;
  loyaltyVisitPerPoint?: number;
  loyaltyPointsRequired?: number;
  loyaltyRewardHours?: 'ONE_HOUR' | 'THREE_HOURS' | 'SIX_HOURS' | 'EIGHT_HOURS';
  mapImageUrl?: string;
  open24Hours?: boolean;
  openingTime?: string;
  closingTime?: string;
  contactPhone?: string;
}



