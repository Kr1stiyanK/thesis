import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DataService, LoyaltySummary, ParkingScheduleMeta} from "../../service/data.service";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  bookingDetails: any;
  totalPrice: number;
  isGuestUser: boolean;
  loyaltyInfo: LoyaltySummary | null = null;
  useBonus = false;
  canUseBonus = false;
  pricePerHourBgn: number | null = null;

  readonly BGN_TO_EUR = 1.95583;

  get totalPriceEur(): number {
    return this.totalPrice / this.BGN_TO_EUR;
  }

  get discountBgn(): number {
    if (!this.useBonus || !this.canUseBonus) {
      return 0;
    }
    if (!this.loyaltyInfo?.rewardHours || !this.pricePerHourBgn) {
      return 0;
    }

    const discount = this.loyaltyInfo.rewardHours * this.pricePerHourBgn;
    // не допускаме отстъпка по-голяма от сумата
    return Math.min(discount, this.totalPrice);
  }

  get finalPriceBgn(): number {
    return this.totalPrice - this.discountBgn;
  }

  get finalPriceEur(): number {
    return this.finalPriceBgn / this.BGN_TO_EUR;
  }

  constructor(
    private router: Router,
    private ds: DataService,
    private fb: FormBuilder
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bookingDetails: any; totalPrice: number; useBonus?: boolean };

    this.bookingDetails = state?.bookingDetails;
    this.totalPrice = state?.totalPrice ?? 0;
    this.useBonus = !!state?.useBonus;

    this.paymentForm = this.fb.group({
      cardNumber: ['', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        Validators.pattern(/^[0-9]{16}$/)
      ]],
      cardName: ['', Validators.required],
      expiryDate: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
      ]],
      cvv: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.pattern(/^[0-9]{3}$/)
      ]],
    });

    this.isGuestUser = !localStorage.getItem('jwtToken');
  }

  ngOnInit(): void {
    if (!this.bookingDetails) {
      this.router.navigate(['/']);
      return;
    }
    // 1) зареждаме bonus инфото (ако е логнат)
    if (!this.isGuestUser && this.bookingDetails.parkingId) {
      this.ds.getLoyaltyForParking(this.bookingDetails.parkingId)
        .subscribe({
          next: info => {
            this.loyaltyInfo = info;
            this.canUseBonus = info.loyaltyEnabled && info.canUseBonus;
          },
          error: err => console.error('Error loading loyalty info', err)
        });
      // 2) зареждаме цената на час за този паркинг
      this.ds.getParkingScheduleMeta(this.bookingDetails.parkingId)
        .subscribe({
          next: (meta: ParkingScheduleMeta) => {
            this.pricePerHourBgn = meta.pricePerHourBgn || null;
          },
          error: err => console.error('Error loading meta', err)
        });
    }
  }

  onPaymentSubmit() {
    if (this.paymentForm.valid) {
      if (this.isGuestUser) {
        this.ds.quickBooking(this.bookingDetails).subscribe(
          (response) => {
            this.router.navigate(['/booking-success'], {state: {bookingDetails: this.bookingDetails}});
          },
          (error) => {
            alert('Payment failed: ' + error.message);
          }
        );
      } else {
        this.ds.createParkingBooking(this.bookingDetails.parkingId,this.bookingDetails).subscribe(
          (response) => {
            this.router.navigate(['/scheduler'], {queryParams: {parkingId: this.bookingDetails.parkingId}});
          },
          (error) => {
            alert('Payment failed: ' + error.message);
          }
        );
      }
    }
  }

  // onPaymentSubmit() {
  //   if (this.paymentForm.invalid || !this.bookingDetails) {
  //     this.paymentForm.markAllAsTouched();
  //     return;
  //   }
  //
  //   if (this.isGuestUser) {
  //     // GUEST → използваме quickBooking (без spaceNumber)
  //     const dto = {
  //       parkingId: this.bookingDetails.parkingId,
  //       startTime: this.bookingDetails.startTime, // ISO string
  //       endTime: this.bookingDetails.endTime
  //     };
  //
  //     this.ds.quickBooking(dto).subscribe({
  //       next: (created) => {
  //         this.router.navigate(['/booking-success'], {
  //           state: {bookingDetails: created}
  //         });
  //       },
  //       error: (error) => {
  //         console.error(error);
  //         alert('Payment / booking failed: ' + (error.message || 'Unknown error'));
  //       }
  //     });
  //
  //   } else {
  //     // LOGGED-IN → текущия flow с избрано място
  //     const parkingId = this.bookingDetails.parkingId;
  //     const dto = {
  //       spaceNumber: this.bookingDetails.spaceNumber,
  //       startTime: this.bookingDetails.startTime,
  //       endTime: this.bookingDetails.endTime,
  //       useBonus: this.useBonus && this.canUseBonus
  //     };
  //
  //     this.ds.createParkingBooking(parkingId, dto).subscribe({
  //       next: (created) => {
  //         this.router.navigate(['/scheduler'], {queryParams: {parkingId}});
  //       },
  //       error: (error) => {
  //         console.error(error);
  //         alert('Payment / booking failed: ' + (error.message || 'Unknown error'));
  //       }
  //     });
  //   }
  // }
}
