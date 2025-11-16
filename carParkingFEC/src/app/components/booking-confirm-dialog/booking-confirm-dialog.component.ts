import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-booking-confirm-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-confirm-dialog.component.html',
  styleUrl: './booking-confirm-dialog.component.css'
})
export class BookingConfirmDialogComponent {

  @Input() visible = false;
  @Input() data!: BookingPreviewData | null;

  @Output() confirm = new EventEmitter<{ paymentMethod: PaymentMethod }>();
  @Output() cancel = new EventEmitter<void>();

  paymentMethod: PaymentMethod = 'cash';

  readonly BGN_TO_EUR = 1.95583;

  get priceInEur(): number {
    if (!this.data) return 0;
    return this.data.totalPrice / this.BGN_TO_EUR;
  }


  onConfirm() {
    if (!this.data) {
      return;
    }
    if (this.paymentMethod === 'card' && !this.data.cardPaymentEnabled) {
      return;
    }
    this.confirm.emit({paymentMethod: this.paymentMethod});
  }

  onCancel() {
    this.cancel.emit();
  }

  formattedTime(date: Date | undefined): string {
    if (!date) {
      return '';
    }
    return date.toLocaleString([], {hour: '2-digit', minute: '2-digit'});
  }
}

export type PaymentMethod = 'cash' | 'card';

export interface BookingPreviewData {
  parkingName: string;
  spaceNumber: number;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  cardPaymentEnabled: boolean;
}
