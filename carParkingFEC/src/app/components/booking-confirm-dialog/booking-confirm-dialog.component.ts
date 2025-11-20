import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {LoyaltySummary} from "../../service/data.service";

@Component({
  selector: 'app-booking-confirm-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-confirm-dialog.component.html',
  styleUrl: './booking-confirm-dialog.component.css'
})
export class BookingConfirmDialogComponent implements OnChanges {

  @Input() visible = false;
  @Input() data: BookingPreviewData | null = null;

  @Output() confirm = new EventEmitter<{ paymentMethod: 'cash' | 'card', useBonus: boolean, finalPriceBgn: number }>();
  @Output() cancel = new EventEmitter<void>();

  paymentMethod: 'cash' | 'card' = 'cash';
  useBonus = false;

  readonly BGN_TO_EUR = 1.95583;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || (changes['visible'] && !this.visible)) {
      this.paymentMethod = 'cash';
      this.useBonus = false;
    }
  }

  get hasBonus(): boolean {
    return !!this.data?.loyaltyInfo?.loyaltyEnabled;
  }

  get hasBonusProgram(): boolean {
    return !!this.data?.loyaltyInfo;
  }

  get canUseBonus(): boolean {
    return !!this.data?.loyaltyInfo?.canUseBonus;
  }

  get rewardHours(): number {
    return this.data?.loyaltyInfo?.rewardHours ?? 0;
  }

  get discountBgn(): number {
    if (!this.useBonus || !this.data || !this.hasBonus) {
      return 0;
    }

    const ms = this.data.endTime.getTime() - this.data.startTime.getTime();
    const hours = ms / (1000 * 60 * 60);
    const freeHours = Math.min(hours, this.rewardHours);
    const discount = freeHours * (this.data.pricePerHourBgn || 0);

    return Math.min(discount, this.data.totalPrice);
  }

  get finalPriceBgn(): number {
    if (!this.data) return 0;
    return this.data.totalPrice - this.discountBgn;
  }

  get finalPriceEur(): number {
    return this.finalPriceBgn / this.BGN_TO_EUR;
  }

  onConfirm() {
    if (!this.data) {
      return;
    }
    if (this.paymentMethod === 'card' && !this.data.cardPaymentEnabled) {
      return;
    }
    this.confirm.emit({
      paymentMethod: this.paymentMethod,
      useBonus: this.useBonus && this.canUseBonus,
      finalPriceBgn: this.finalPriceBgn
    });
  }

  onCancel() {
    this.cancel.emit();
    this.paymentMethod = 'cash';
    this.useBonus = false;
  }

  formattedTime(date: Date | undefined): string {
    if (!date) {
      return '';
    }
    return date.toLocaleString([], {hour: '2-digit', minute: '2-digit'});
  }
}

export interface BookingPreviewData {
  parkingName: string;
  spaceNumber: number;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  cardPaymentEnabled: boolean;
  pricePerHourBgn: number;
  loyaltyInfo?: LoyaltySummary;
}

export interface QuickBookingPreviewData{
  parkingName: string;
  spaceNumber: number;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  cardPaymentEnabled: boolean;
  pricePerHourBgn: number;
  loyaltyInfo?: LoyaltySummary;
  spacesCount?: number;
  open24Hours?: boolean;
  openingTime?: string;
  closingTime?: string;
  pricePerHourEur?: number;
}
