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


  constructor(private service: DataService) {
  }

  ngOnInit() {
    this.sub = timer(0, 10000).pipe(
      switchMap(() => this.service.getFreeNow())
    ).subscribe({
      next: (val) => this.freeNow = val,
      error: () => this.freeNow = null
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

}
