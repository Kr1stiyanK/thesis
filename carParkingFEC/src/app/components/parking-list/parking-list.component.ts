import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParkingHome } from '../home/home.component';  // или отделен файл за модела, ако искаш

@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parking-list.component.html',
  styleUrl: './parking-list.component.css'
})
export class ParkingListComponent {

  @Input() parkings: ParkingHome[] = [];
  @Input() title = 'Налични паркинги';
  @Input() mode: 'guest' | 'user' | 'admin' = 'guest';

  readonly BGN_TO_EUR = 1.95583;

  constructor(private router: Router) {}

  onAction(p: ParkingHome): void {
    if (this.mode === 'admin') {
      this.router.navigate(['/my-parkings'], { queryParams: { parkingId: p.id } });
    } else {
      this.router.navigate(['/scheduler'], {
        queryParams: { parkingId: p.id }
      });
    }
  }

  rewardLabel(p: ParkingHome): string {
    switch (p.loyaltyRewardHours) {
      case 'ONE_HOUR': return '1 час';
      case 'THREE_HOURS': return '3 часа';
      case 'SIX_HOURS': return '6 часа';
      case 'EIGHT_HOURS': return '8 часа';
      default: return '-';
    }
  }

  workHoursLabel(p: ParkingHome): string {
    if (p.open24Hours) {
      return 'Денонощно (24/7)';
    }
    if (!p.openingTime || !p.closingTime) {
      return '-';
    }
    const from = p.openingTime.slice(0, 5);
    const to = p.closingTime.slice(0, 5);
    return `${from} – ${to}`;
  }

  priceInEur(priceBgn: number): number {
    return priceBgn / this.BGN_TO_EUR;
  }

  bookHere(p: ParkingHome) {
    this.router.navigate(['/scheduler'], {
      queryParams: { parkingId: p.id }
    });
  }
}
