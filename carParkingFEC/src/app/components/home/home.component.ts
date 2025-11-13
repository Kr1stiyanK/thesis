import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Subscription, switchMap, timer} from "rxjs";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  freeNow: number | null = null;
  totalSpots = 20;
  private sub?: Subscription;
  parkings: ParkingHome[] = [];


  constructor(private service: DataService) {
  }

  ngOnInit() {
    // this.sub = timer(0, 10000).pipe(
    //   switchMap(() => this.service.getFreeNow())
    // ).subscribe({
    //   next: (val) => this.freeNow = val,
    //   error: () => this.freeNow = null
    // });
    this.loadParkings();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private loadParkings(): void{
    this.service.getParkingsForHome()
      .subscribe({
        next: data => this.parkings = data,
        error: err => console.error('Error loading parkings', err)
      });
  }


}

export interface ParkingHome {
  id: number;
  name: string;
  address: string;
  freeSpaces: number;
  pricePerHourBgn: number;
}
