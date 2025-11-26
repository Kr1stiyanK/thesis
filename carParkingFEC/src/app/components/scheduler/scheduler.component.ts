import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  DataService,
  ParkingScheduleMeta,
  BookingSlot, LoyaltySummary
} from '../../service/data.service';
import {CommonModule} from '@angular/common';
import {
  BookingConfirmDialogComponent,
  BookingPreviewData
} from '../booking-confirm-dialog/booking-confirm-dialog.component';
import {Subscription, interval} from "rxjs";

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, BookingConfirmDialogComponent],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.css'
})
export class SchedulerComponent implements OnInit, OnDestroy {

  parkingId!: number;
  parkingMeta!: ParkingScheduleMeta;
  selectedDate: Date = new Date();
  spaces: number[] = [];
  timeSlots: TimeSlot[] = [];
  bookings: BookingSlot[] = [];
  loading = false;
  error: string | null = null;

  // section view
  selectionSpace: number | null = null;
  selectionStartIndex: number | null = null;
  selectionEndIndex: number | null = null;

  // dialog view
  dialogVisible = false;
  dialogData: BookingPreviewData | null = null;
  pendingSpace: number | null = null;
  pendingStart: Date | null = null;
  pendingEnd: Date | null = null;

  loyaltyInfo: LoyaltySummary | null = null;

  readonly BGN_TO_EUR = 1.95583;

  private bookingsPollSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.parkingId = Number(this.route.snapshot.queryParamMap.get('parkingId'));
    if (!this.parkingId) {
      this.error = 'Не е избран паркинг.';
      return;
    }

    this.loadMetaAndSchedule();
    this.loadLoyalty();
  }

  ngOnDestroy(): void {
    this.stopPollingBookings();
  }


  /** Локална дата yyyy-MM-dd (без timezone) */
  private formatDateLocal(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /** Локален LocalDateTime string yyyy-MM-ddTHH:mm:ss */
  private buildLocalDateTimeString(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');
    return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
  }

  // -----------------------------------------------------

  private loadLoyalty(): void {
    this.dataService.getLoyaltyForParking(this.parkingId).subscribe({
      next: info => this.loyaltyInfo = info,
      error: err => {
        console.error('Грешка при зареждане на бонус информацията', err);
        this.loyaltyInfo = null;
      }
    });
  }

  // -----------------------------------------------------

  loadMetaAndSchedule(): void {
    this.loading = true;
    this.error = null;

    this.dataService.getParkingScheduleMeta(this.parkingId).subscribe({
      next: meta => {
        this.parkingMeta = meta;
        this.spaces = Array.from({length: meta.spacesCount}, (_, i) => i + 1);
        this.buildTimeSlots();
        this.loadBookings();
        this.startPollingBookings();
      },
      error: err => {
        console.error(err);
        this.error = 'Грешка при зареждане на паркинга.';
        this.loading = false;
      }
    });
  }

  priceInEur(bgn: number | null | undefined): number {
    if (!bgn) {
      return 0;
    }
    return bgn / this.BGN_TO_EUR;
  }

  private buildTimeSlots(): void {
    const date = this.selectedDate;
    const slots: TimeSlot[] = [];

    let startHour = 0;
    let endHour = 24;

    if (!this.parkingMeta.open24Hours) {
      const open = this.parkingMeta.openingTime;
      const close = this.parkingMeta.closingTime;
      startHour = parseInt(open!.substring(0, 2), 10);
      endHour = parseInt(close!.substring(0, 2), 10);
    }

    for (let h = startHour; h < endHour; h++) {
      const s = new Date(date);
      s.setHours(h, 0, 0, 0);
      const e = new Date(date);
      e.setHours(h + 1, 0, 0, 0);

      slots.push({
        label: `${h.toString().padStart(2, '0')}:00`,
        start: s,
        end: e,
        hour: h
      });
    }

    this.timeSlots = slots;
  }

  private loadBookings(): void {
    const dateStr = this.formatDateLocal(this.selectedDate);

    this.dataService.getParkingBookings(this.parkingId, dateStr).subscribe({
      next: bookings => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Грешка при зареждане на резервациите.';
        this.loading = false;
      }
    });
  }

  private calculateTotalPrice(start: Date, end: Date): number {
    const ms = end.getTime() - start.getTime();
    const hours = ms / (1000 * 60 * 60);
    const pricePerHour = this.parkingMeta.pricePerHourBgn || 0;
    return hours * pricePerHour;
  }

  private startPollingBookings(): void {
    this.stopPollingBookings();

    this.bookingsPollSub = interval(10000).subscribe(() => {
      this.loadBookings();
    });
  }

  private stopPollingBookings(): void {
    if (this.bookingsPollSub) {
      this.bookingsPollSub.unsubscribe();
      this.bookingsPollSub = undefined;
    }
  }


  isPast(slot: TimeSlot): boolean {
    const now = new Date();

    const today = new Date(now);

    const slotDay = new Date(slot.start);

    if (slotDay.getTime() < today.getTime()) {
      return true;
    }

    if (slotDay.getTime() > today.getTime()) {
      return false;
    }

    return slot.start.getTime() <= now.getTime();
  }

  isBooked(spaceNumber: number, slot: TimeSlot): BookingSlot | undefined {
    return this.bookings.find(b =>
      b.spaceNumber === spaceNumber &&
      new Date(b.startTime).getTime() < slot.end.getTime() &&
      new Date(b.endTime).getTime() > slot.start.getTime()
    );
  }

  onSlotClick(spaceNumber: number, slot: TimeSlot, slotIndex: number): void {
    if (this.isPast(slot)) {
      return;
    }
    const existing = this.isBooked(spaceNumber, slot);
    if (existing) {
      return;
    }

    if (this.selectionSpace === null) {
      this.selectionSpace = spaceNumber;
      this.selectionStartIndex = slotIndex;
      this.selectionEndIndex = slotIndex;
      return;
    }

    if (this.selectionSpace !== spaceNumber) {
      this.selectionSpace = spaceNumber;
      this.selectionStartIndex = slotIndex;
      this.selectionEndIndex = slotIndex;
      return;
    }

    if (slotIndex < (this.selectionStartIndex ?? 0)) {
      this.selectionStartIndex = slotIndex;
      this.selectionEndIndex = slotIndex;
      return;
    }

    this.selectionEndIndex = slotIndex;

    const startIdx = this.selectionStartIndex!;
    const endIdx = this.selectionEndIndex!;

    const fromIdx = Math.min(startIdx, endIdx);
    const toIdx = Math.max(startIdx, endIdx);

    const startSlot = this.timeSlots[fromIdx];
    const endHour = this.timeSlots[toIdx].hour + 1;

    this.pendingSpace = spaceNumber;
    this.pendingStart = startSlot.start;
    const end = new Date(this.selectedDate);
    end.setHours(endHour, 0, 0, 0);
    this.pendingEnd = end;

    const totalPrice = this.calculateTotalPrice(this.pendingStart, this.pendingEnd);

    this.dialogData = {
      parkingName: this.parkingMeta.name,
      spaceNumber: spaceNumber,
      startTime: this.pendingStart,
      endTime: this.pendingEnd,
      totalPrice: totalPrice,
      cardPaymentEnabled: this.parkingMeta.cardPaymentEnabled,
      pricePerHourBgn: this.parkingMeta.pricePerHourBgn || 0,
      loyaltyInfo: this.loyaltyInfo || undefined
    };

    this.dialogVisible = true;
  }

  onDialogCancel(): void {
    this.dialogVisible = false;
    this.dialogData = null;
    this.clearSelection();
  }

  onDialogConfirm(event: { paymentMethod: 'cash' | 'card'; useBonus: boolean; finalPriceBgn: number }): void {
    if (!this.pendingStart || !this.pendingEnd || !this.pendingSpace) {
      this.onDialogCancel();
      return;
    }

    const originalTotal = this.calculateTotalPrice(this.pendingStart, this.pendingEnd);
    const effectiveTotal = event.finalPriceBgn ?? originalTotal;

    const startStr = this.buildLocalDateTimeString(this.pendingStart);
    const endStr = this.buildLocalDateTimeString(this.pendingEnd);

    const bookingData: any = {
      parkingId: this.parkingId,
      spaceNumber: this.pendingSpace,
      startTime: startStr,
      endTime: endStr,
      useBonus: event.useBonus
    };

    // 1) If amount == 0 then simply create the reservation
    if (effectiveTotal === 0) {
      this.dataService.createParkingBooking(this.parkingId, bookingData)
        .subscribe({
          next: () => {
            this.loadBookings();
            this.loadLoyalty();
            this.onDialogCancel();
          },
          error: (err) => {
            alert('Резервацията не може да бъде създадена.');
            console.error(err);
            this.onDialogCancel();
          }
        });
      return;
    }

    // 2) Card payment with amount > 0
    if (event.paymentMethod === 'card') {
      this.dialogVisible = false;

      this.router.navigate(
        ['/payment'],
        {
          state: {
            bookingDetails: bookingData,
            totalPrice: effectiveTotal,
            useBonus: event.useBonus
          }
        }
      );

      this.clearSelection();
      return;
    }

    // Cash payment when amount > 0
    this.dataService.createParkingBooking(this.parkingId, bookingData)
      .subscribe({
        next: () => {
          this.loadBookings();
          this.loadLoyalty();
          this.onDialogCancel();
        },
        error: (err) => {
          alert('Резервацията не може да бъде създадена.');
          console.error(err);
          this.onDialogCancel();
        }
      });
  }

  clearSelection(): void {
    this.selectionSpace = null;
    this.selectionStartIndex = null;
    this.selectionEndIndex = null;
  }

  isSelected(spaceNumber: number, slotIndex: number): boolean {
    if (
      this.selectionSpace === null ||
      this.selectionStartIndex === null ||
      this.selectionEndIndex === null
    ) {
      return false;
    }
    if (spaceNumber !== this.selectionSpace) {
      return false;
    }
    const fromIdx = Math.min(this.selectionStartIndex, this.selectionEndIndex);
    const toIdx = Math.max(this.selectionStartIndex, this.selectionEndIndex);
    return slotIndex >= fromIdx && slotIndex <= toIdx;
  }

  changeDate(offsetDays: number): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + offsetDays);
    this.selectedDate = d;
    this.clearSelection();
    this.buildTimeSlots();
    this.loadBookings();
    this.startPollingBookings();
  }
}

interface TimeSlot {
  label: string;
  start: Date;
  end: Date;
  hour: number;
}
