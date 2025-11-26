import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DataService, ParkingScheduleMeta} from "../../service/data.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {
  BookingConfirmDialogComponent,
  QuickBookingPreviewData
} from "../booking-confirm-dialog/booking-confirm-dialog.component";

@Component({
  selector: 'app-quick-booking',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, BookingConfirmDialogComponent],
  templateUrl: './quick-booking.component.html',
  styleUrl: './quick-booking.component.css'
})
export class QuickBookingComponent implements OnInit {

  form: FormGroup;
  parkingId!: number;
  parkingMeta!: ParkingScheduleMeta;
  dialogVisible = false;
  dialogData: QuickBookingPreviewData | null = null;
  pendingStart: Date | null = null;
  pendingEnd: Date | null = null;
  readonly BGN_TO_EUR = 1.95583;
  hourOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ds: DataService
  ) {
    this.form = this.fb.group({
      startDate: [null, Validators.required],   // 'YYYY-MM-DD'
      endDate: [null, Validators.required],   // 'YYYY-MM-DD'
      startTime: ['', Validators.required],     // 'HH:mm'
      endTime: ['', Validators.required],     // 'HH:mm'
    });
  }

  ngOnInit(): void {
    const pid = this.route.snapshot.queryParamMap.get('parkingId');
    this.parkingId = pid ? Number(pid) : 0;

    if (!this.parkingId) {
      this.router.navigate(['/quick-booking-select']);
      return;
    }

    this.ds.getParkingScheduleMeta(this.parkingId).subscribe({
      next: meta => {
        this.parkingMeta = meta;
        this.buildHourOptions();
      },
      error: err => {
        console.error(err);
        alert('Грешка при зареждане на паркинга.');
        this.router.navigate(['/quick-booking-select']);
      }
    });
  }

  // Date -> 'yyyy-MM-ddTHH:mm:ss'
  private toLocalDateTimeString(dt: Date): string {
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1).toString().padStart(2, '0');
    const d = dt.getDate().toString().padStart(2, '0');
    const hh = dt.getHours().toString().padStart(2, '0');
    const mm = dt.getMinutes().toString().padStart(2, '0');
    const ss = dt.getSeconds().toString().padStart(2, '0');
    return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
  }

  private calculateTotalPrice(start: Date, end: Date): number {
    const ms = end.getTime() - start.getTime();
    const hours = ms / (1000 * 60 * 60);
    const pricePerHour = this.parkingMeta.pricePerHourBgn || 0;
    return hours * pricePerHour;
  }

  // ------------------- ВАЛИДАЦИЯ -------------------

  onCheckAvailability(): void {
    if (this.form.invalid || !this.parkingMeta) {
      this.form.markAllAsTouched();
      return;
    }

    const startDateStr: string = this.form.value.startDate;
    const endDateStr: string = this.form.value.endDate;
    const startTimeStr: string = this.form.value.startTime;
    const endTimeStr: string = this.form.value.endTime;

    if (!startDateStr || !endDateStr || !startTimeStr || !endTimeStr) {
      alert('Моля, попълнете всички полета.');
      return;
    }

    const [sh, sm] = startTimeStr.split(':').map(Number);
    const [eh, em] = endTimeStr.split(':').map(Number);

    if ([sh, sm, eh, em].some(v => isNaN(v))) {
      alert('Невалиден формат на часа.');
      return;
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const start = new Date(startDate);
    start.setHours(sh, sm, 0, 0);

    const end = new Date(endDate);
    end.setHours(eh, em, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Невалидна дата.');
      return;
    }

    // 1) начало трябва да е преди края
    if (start >= end) {
      alert('Крайният час/дата трябва да е след началния.');
      return;
    }

    // 2) не може в миналото
    const now = new Date();
    now.setMinutes(now.getMinutes() - 3, 0, 0);

    if (start <= now) {
      alert('Началният час вече е минал.');
      return;
    }

    // 3) работно време
    if (!this.parkingMeta.open24Hours) {
      // за не-24/7 паркинг не позволяваме резервация в различни дни
      const startDay = new Date(startDate);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(endDate);
      endDay.setHours(0, 0, 0, 0);

      if (startDay.getTime() !== endDay.getTime()) {
        alert('За този паркинг резервацията трябва да е в рамките на един ден.');
        return;
      }

      const openStr = this.parkingMeta.openingTime || '08:00:00';
      const closeStr = this.parkingMeta.closingTime || '20:00:00';

      const [openH, openM] = openStr.split(':').map(Number);
      const [closeH, closeM] = closeStr.split(':').map(Number);

      const openDate = new Date(startDate);
      openDate.setHours(openH, openM, 0, 0);

      const closeDate = new Date(startDate);
      closeDate.setHours(closeH, closeM, 0, 0);

      if (start < openDate || end > closeDate) {
        const openLabel = `${openH.toString().padStart(2, '0')}:${openM.toString().padStart(2, '0')}`;
        const closeLabel = `${closeH.toString().padStart(2, '0')}:${closeM.toString().padStart(2, '0')}`;
        alert(`Работното време на паркинга е от ${openLabel} до ${closeLabel}.`);
        return;
      }
    }
    // ако е 24/7 – няма ограничение за дните и часовете (освен че start < end и start > now)

    // 4) check availability към бекенда

    const startStr = this.toLocalDateTimeString(start);
    const endStr = this.toLocalDateTimeString(end);

    this.ds.checkQuickBookingAvailability(this.parkingId, startStr, endStr).subscribe({
      next: resp => {
        if (!resp.available) {
          const goHome = confirm(
            'За този период няма свободни места на този паркинг.\n' +
            'Искате ли да изберете друг паркинг?'
          );
          if (goHome) {
            this.router.navigate(['/home']);
          }
          return;
        }

        // пазим, за диалога и истинското създаване
        this.pendingStart = start;
        this.pendingEnd = end;

        const totalPrice = this.calculateTotalPrice(start, end);
        const pricePerHourBgn = this.parkingMeta.pricePerHourBgn || 0;
        const pricePerHourEur = pricePerHourBgn / this.BGN_TO_EUR;

        this.dialogData = {
          parkingName: this.parkingMeta.name,
          spaceNumber: 0,
          startTime: start,
          endTime: end,
          totalPrice,
          cardPaymentEnabled: this.parkingMeta.cardPaymentEnabled,
          pricePerHourBgn,
          loyaltyInfo: undefined,
          spacesCount: this.parkingMeta.spacesCount,
          open24Hours: this.parkingMeta.open24Hours,
          openingTime: this.parkingMeta.openingTime,
          closingTime: this.parkingMeta.closingTime,
          pricePerHourEur
        };

        this.dialogVisible = true;
      },
      error: err => {
        console.error(err);
        alert('Грешка при проверка на наличността.');
      }
    });
  }

  // ------------------- Диалог -------------------

  onDialogCancel(): void {
    this.dialogVisible = false;
    this.dialogData = null;
    this.pendingStart = null;
    this.pendingEnd = null;
  }

  onDialogConfirm(event: { paymentMethod: 'cash' | 'card'; useBonus: boolean; finalPriceBgn: number }): void {
    if (!this.pendingStart || !this.pendingEnd) {
      this.onDialogCancel();
      return;
    }

    const startStr = this.toLocalDateTimeString(this.pendingStart);
    const endStr = this.toLocalDateTimeString(this.pendingEnd);

    const bookingRequest = {
      parkingId: this.parkingId,
      startTime: startStr,
      endTime: endStr
    };

    if (event.paymentMethod === 'card') {
      this.dialogVisible = false;
      this.router.navigate(
        ['/payment'],
        {
          state: {
            bookingDetails: bookingRequest,
            totalPrice: event.finalPriceBgn,
            useBonus: false,
            isGuest: true
          }
        }
      );
      return;
    }

    this.ds.quickBooking(bookingRequest).subscribe(
      () => {
        this.router.navigate(['/booking-success']);
      },
      (error: any) => {
        alert('Failed to create booking: ' + error.message);
      }
    );
  }

  private buildHourOptions(): void {
    this.hourOptions = [];

    let startHour = 0;
    let endHour = 24;

    if (!this.parkingMeta.open24Hours) {
      // openingTime / closingTime са примерно '07:00:00'
      const open = this.parkingMeta.openingTime || '08:00:00';
      const close = this.parkingMeta.closingTime || '20:00:00';

      startHour = parseInt(open.substring(0, 2), 10);
      endHour = parseInt(close.substring(0, 2), 10);
    }

    // правим кръгли часове в 24-часов формат: 07:00, 08:00, ...
    for (let h = startHour; h <= endHour; h++) {
      const label = `${h.toString().padStart(2, '0')}:00`;
      this.hourOptions.push(label);
    }
  }

}
