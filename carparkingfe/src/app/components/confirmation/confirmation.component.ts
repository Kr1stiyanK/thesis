import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  bookingDetails: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.bookingDetails = this.route.snapshot.queryParams;
  }

  // Тук може да се добавят методи за обработка на плащанията
  payWithCard(): void {

  }

  payWithCash(): void {

  }
}
