// import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
// import {DayPilot, DayPilotModule, DayPilotSchedulerComponent} from "daypilot-pro-angular";
//
// import {HttpClientModule} from "@angular/common/http";
// import {CheckAvailabilityParams, EventDeleteParams, EventMoveParams} from "../../service/data.service";
// import {DataService} from "../../service/data.service";
// import {CreateComponent} from "../create/create.component";
// import {EditComponent} from "../edit/edit.component";
// import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {ActivatedRoute, Router, RouterModule} from "@angular/router";
// import {CommonModule} from "@angular/common";
//
//
// @Component({
//   selector: 'app-scheduler',
//   standalone: true,
//   templateUrl: './scheduler.component.html',
//   styleUrl: './scheduler.component.css',
//   imports: [DayPilotModule, HttpClientModule, CreateComponent, EditComponent, FormsModule, RouterModule, ReactiveFormsModule, CommonModule]
// })
// export class SchedulerComponent implements AfterViewInit, OnInit {
//
//   selectedParkingId: number | null = null;
//
//   @ViewChild("scheduler")
//   scheduler!: DayPilotSchedulerComponent;
//
//   @ViewChild("create") create!: CreateComponent;
//
//   @ViewChild("edit") edit!: EditComponent;
//
//   // filter: any = {
//   //   shortOnly: false,
//   //   freeOnly: false
//   // };
//   events: DayPilot.EventData[] = [];
//   // events:any[] = [];
//   config: any = {
//     timeHeaders: [
//       {groupBy: 'Day', format: 'dddd, MMMM d, yyyy'},
//       {groupBy: 'Hour', format: "h tt"},
//     ],
//     scale: 'Hour',
//     // startDate: DayPilot.Date.today(),
//     // days: DayPilot.Date.today().daysInYear(),
//     startDate: DayPilot.Date.today().addDays(-10),
//     days: 40,
//     businessBeginsHour: 8,
//     businessEndsHour: 21,
//     cellDuration: 60,
//     businessWeekends: true,
//     showNonBusiness: false,
//     resources: [],
//     eventMoveHandling: "Disabled",
//     eventResizeHandling: "Disabled",
//     contextMenu: new DayPilot.Menu({
//       items: [
//         {
//           text: 'Edit',
//           onClick: args => {
//             const event = args.source;
//             if (this.userRole === 'USER' && event.data.userId === this.currentUserId) {
//               this.edit.show(event);
//             } else {
//               alert('This is not your booking or you do not have permission to edit.');
//             }
//           }
//         },
//       ]
//     }),
//     // onEventFilter: (args: any) => {
//     //   const params = args.filterParam;
//     //   if (params.shortOnly && args.e.duration() > DayPilot.Duration.ofHours(2)) {
//     //     args.visible = false;
//     //   }
//     //   if (params.freeOnly && !this.isParkingSpaceFree(args.e.resource(), args.e.start(), args.e.end())) {
//     //     args.visible = false;
//     //   }
//     // },
//
//     onBeforeEventRender: (args: any) => {
//       args.data.barColor = "#cc004c";
//
//       if (this.userRole === 'ADMIN') {
//         args.data.areas = [
//           {
//             right: 5,
//             top: 7,
//             width: 24,
//             height: 24,
//             symbol: "/assets/daypilot.svg#x-circle",
//             fontColor: "#777777",
//             toolTip: "Delete",
//             onClick: (args: any) => {
//               const e = args.source;
//               const params: EventDeleteParams = {
//                 id: e.id(),
//               };
//               this.service.deleteEvent(params).subscribe(result => {
//                 this.scheduler.control.events.remove(e);
//                 this.scheduler.control.message("Booking deleted");
//               });
//             }
//           },
//         ];
//       }
//     },
//     onTimeRangeSelected: (args: any) => {
//
//       const now = DayPilot.Date.today();
//       if (args.start < now) {
//         this.scheduler.control.message("Cannot book in the past.");
//         this.scheduler.control.clearSelection();
//         return;
//       }
//
//       const start = new DayPilot.Date(args.start).getHours();
//       const end = new DayPilot.Date(args.end).getHours();
//       const duration = end - start;
//
//       if (duration < 2) {
//         this.scheduler.control.message("Booking must be at least 1 hour.");
//         this.scheduler.control.clearSelection();
//         return;
//       }
//
//       this.create.show({
//         start: args.start,
//         end: args.end,
//         name: "",
//         resource: args.resource
//       });
//     },
//     onEventMove: (args: any) => {
//       if (args.newResource !== args.e.resource()) {
//         args.preventDefault();
//         this.scheduler.control.message("You can only move the booking within the same resource.");
//         return;
//       }
//
//       if (!this.isWithinBusinessHours(args.newStart, args.newEnd)) {
//         args.preventDefault();
//         this.scheduler.control.message("Booking must be within business hours (08:00 - 20:00).");
//         return;
//       }
//
//       let checkParams: CheckAvailabilityParams = {
//         resourceId: args.newResource,
//         startTime: args.newStart.toString(),
//         endTime: args.newEnd.toString(),
//         bookingId: args.e.id(),
//       };
//
//       this.service.checkParkingSpaceAvailability(checkParams).subscribe((response: any) => {
//         if (response.available) {
//           let params: EventMoveParams = {
//             bookingId: args.e.id(),
//             startTime: args.newStart.toString(),
//             endTime: args.newEnd.toString(),
//             resourceId: args.newResource
//           };
//           this.service.moveEvent(params).subscribe(result => {
//             this.scheduler.control.message("Booking moved");
//           }, error => {
//             args.preventDefault(); // Prevent the event from being moved visually
//             this.scheduler.control.message("Failed to move booking: " + error.error.message);
//             this.loadEvents() // Revert the event to its original position
//           });
//         } else {
//           args.preventDefault();
//           this.scheduler.control.message("The new time overlaps with an existing booking.");
//           this.loadEvents(); // Revert the event to its original position
//         }
//       }, error => {
//         args.preventDefault();
//         this.scheduler.control.message("Failed to check availability: " + error.message);
//         this.loadEvents();
//       });
//     }
//   };
//
//   userRole: string = '';
//   currentUserId: number | null = null;
//
//   constructor(private service: DataService, private router: Router,private route: ActivatedRoute) {
//   }
//
//   ngOnInit() {
//     this.route.queryParamMap.subscribe(params => {
//       const pId = params.get('parkingId');
//       this.selectedParkingId = pId ? +pId : null;
//     })
//   }
//
//   ngAfterViewInit(): void {
//     this.service.getUserRole().subscribe(response => {
//       this.userRole = response.role;
//       if (this.userRole === 'ADMIN') {
//         this.config.eventMoveHandling = "Update";
//       }
//     });
//
//     this.service.getCurrentUserObservable().subscribe(user => {
//       this.currentUserId = user;
//     });
//
//     this.service.getResources().subscribe(result => {
//       this.config.resources = result
//     });
//     var from = this.scheduler.control.visibleStart();
//     var to = this.scheduler.control.visibleEnd();
//     this.service.getEvents(from, to).subscribe((result) => {
//       this.events = result.map(event => ({
//           id: event.id,
//           text: event.text,
//           start: event.start,
//           end: event.end,
//           resource: event.resource,
//           userId: event.userId
//         }
//       ));
//
//       this.scheduler.control.update();
//       this.scheduler.control.scrollTo(DayPilot.Date.today());
//
//     });
//   }
//
//   createClosed(args: any) {
//     if (args.result) {
//       this.events.push(args.result);
//       this.scheduler.control.message("Created");
//     }
//     this.scheduler.control.clearSelection();
//   }
//
//   editClosed(args: any) {
//     if (args.result) {
//       this.loadEvents();
//       this.scheduler.control.message("Updated");
//     }
//   }
//
//   loadEvents(): void {
//     const from = this.scheduler.control.visibleStart();
//     const to = this.scheduler.control.visibleEnd();
//
//     this.service.getEvents(from, to).subscribe(result => {
//       this.events = result.map(event => ({
//         id: event.id,
//         text: event.text,
//         start: event.start,
//         end: event.end,
//         resource: event.resource,
//         userId: event.userId
//       }));
//       this.scheduler.control.update({events: this.events});
//       this.scheduler.control.scrollTo(DayPilot.Date.today());
//     });
//   }
//
//   isParkingSpaceFree(resource: any, start: DayPilot.Date, end: DayPilot.Date): boolean {
//     return !this.events.some(event => event.resource === resource && event.start < end && event.end > start);
//   }
//
//   isWithinBusinessHours(start: DayPilot.Date, end: DayPilot.Date): boolean {
//     const businessStart = new DayPilot.Date(start.getDatePart()).addHours(8);
//     const businessEnd = new DayPilot.Date(start.getDatePart()).addHours(20);
//     return start >= businessStart && end <= businessEnd;
//   }
//
//   // changeFree(val: string) {
//   //   this.filter.freeOnly = val;
//   //   this.applyFilter();
//   // }
//   //
//   // changeShort(val: string) {
//   //   this.filter.shortOnly = val;
//   //   this.applyFilter();
//   // }
//   //
//   // applyFilter() {
//   //   this.scheduler.control.events.filter(this.filter);
//   // }
//
//
//   logout() {
//     this.service.logout();
//     this.router.navigate(['/home']);
//   }
//
// }

//16.11 WORKING VERSION BELOW:
// import {Component, OnInit} from '@angular/core';
// import {ActivatedRoute} from '@angular/router';
// import {
//   DataService,
//   ParkingScheduleMeta,
//   BookingSlot
// } from '../../service/data.service';
// import {CommonModule} from '@angular/common';
// import {Router} from "@angular/router";
// import {
//   BookingConfirmDialogComponent,
//   BookingPreviewData
// } from '../booking-confirm-dialog/booking-confirm-dialog.component';
//
// @Component({
//   selector: 'app-scheduler',
//   standalone: true,
//   imports: [CommonModule, BookingConfirmDialogComponent],
//   templateUrl: './scheduler.component.html',
//   styleUrl: './scheduler.component.css'
// })
// export class SchedulerComponent implements OnInit {
//
//   parkingId!: number;
//   parkingMeta!: ParkingScheduleMeta;
//   selectedDate: Date = new Date();
//   spaces: number[] = [];
//   timeSlots: TimeSlot[] = [];
//   bookings: BookingSlot[] = [];
//   loading = false;
//   error: string | null = null;
//   selection:{
//     space: number,
//     startIndex: number;
//     endIndex: number;
//   } | null = null;
//   selectionSpace: number | null = null;
//   selectionStartIndex: number | null = null;
//   selectionEndIndex: number | null = null;
//   dialogVisible = false;
//   dialogData: BookingPreviewData | null = null;
//   pendingSpace: number | null = null;
//   pendingStart: Date | null = null;
//   pendingEnd: Date | null = null;
//
//   readonly BGN_TO_EUR = 1.95583;
//
//   constructor(
//     private route: ActivatedRoute,
//     private dataService: DataService,
//     private router: Router
//   ) {
//   }
//
//   ngOnInit(): void {
//     this.parkingId = Number(this.route.snapshot.queryParamMap.get('parkingId'));
//     if (!this.parkingId) {
//       this.error = 'Не е избран паркинг.';
//       return;
//     }
//
//     this.loadMetaAndSchedule();
//   }
//
//   loadMetaAndSchedule(): void {
//     this.loading = true;
//     this.error = null;
//
//     this.dataService.getParkingScheduleMeta(this.parkingId).subscribe({
//       next: meta => {
//         this.parkingMeta = meta;
//         this.spaces = Array.from({length: meta.spacesCount}, (_, i) => i + 1);
//         this.buildTimeSlots();
//         this.loadBookings();
//       },
//       error: err => {
//         console.error(err);
//         this.error = 'Грешка при зареждане на паркинга.';
//         this.loading = false;
//       }
//     });
//   }
//
//   priceInEur(bgn: number | null | undefined): number {
//     if (!bgn) {
//       return 0;
//     }
//     return bgn / this.BGN_TO_EUR;
//   }
//
//   private buildTimeSlots(): void {
//     const date = this.selectedDate;
//     const slots: TimeSlot[] = [];
//
//     let startHour = 0;
//     let endHour = 24;
//
//     if (!this.parkingMeta.open24Hours) {
//       const open = this.parkingMeta.openingTime || '08:00:00';
//       const close = this.parkingMeta.closingTime || '20:00:00';
//       startHour = parseInt(open.substring(0, 2), 10);
//       endHour = parseInt(close.substring(0, 2), 10);
//     }
//
//     for (let h = startHour; h < endHour; h++) {
//       const s = new Date(date);
//       s.setHours(h, 0, 0, 0);
//       const e = new Date(date);
//       e.setHours(h + 1, 0, 0, 0);
//
//       slots.push({
//         label: `${h.toString().padStart(2, '0')}:00`,
//         start: s,
//         end: e
//       });
//     }
//
//     this.timeSlots = slots;
//   }
//
//   private loadBookings(): void {
//     const dateStr = this.selectedDate.toISOString().substring(0, 10);
//
//     this.dataService.getParkingBookings(this.parkingId, dateStr).subscribe({
//       next: bookings => {
//         this.bookings = bookings;
//         this.loading = false;
//       },
//       error: err => {
//         console.error(err);
//         this.error = 'Грешка при зареждане на резервациите.';
//         this.loading = false;
//       }
//     });
//   }
//
//   private calculateTotalPrice(start: Date, end: Date): number {
//     const ms = end.getTime() - start.getTime();
//     const hours = ms / (1000 * 60 * 60);
//     const pricePerHour = this.parkingMeta.pricePerHourBgn || 0;
//     return hours * pricePerHour;
//   }
//
//
//   isPast(slot: TimeSlot): boolean {
//     const now = new Date();
//     const slotDate = slot.start;
//
//     if (slotDate.toDateString() < now.toDateString()) {
//       return true;
//     }
//     if (slotDate.toDateString() === now.toDateString() &&
//       slot.start.getTime() <= now.getTime()) {
//       return true;
//     }
//     return false;
//   }
//
//   isBooked(spaceNumber: number, slot: TimeSlot): BookingSlot | undefined {
//     return this.bookings.find(b =>
//       b.spaceNumber === spaceNumber &&
//       new Date(b.startTime).getTime() < slot.end.getTime() &&
//       new Date(b.endTime).getTime() > slot.start.getTime()
//     );
//   }
//
//   onSlotClick(spaceNumber: number, slot: TimeSlot, slotIndex: number): void {
//     if (this.isPast(slot)) {
//       return;
//     }
//     const existing = this.isBooked(spaceNumber, slot);
//     if (existing) {
//       return;
//     }
//
//     // ако няма селекция -> начало
//     if (this.selectionSpace === null) {
//       this.selectionSpace = spaceNumber;
//       this.selectionStartIndex = slotIndex;
//       this.selectionEndIndex = slotIndex;
//       return;
//     }
//
//     // друго място -> нова селекция
//     if (this.selectionSpace !== spaceNumber) {
//       this.selectionSpace = spaceNumber;
//       this.selectionStartIndex = slotIndex;
//       this.selectionEndIndex = slotIndex;
//       return;
//     }
//
//     // същия слот -> нулиране
//     if (this.selectionStartIndex === slotIndex && this.selectionEndIndex === slotIndex) {
//       this.clearSelection();
//       return;
//     }
//
//     // по-рано от началото -> започваме оттук
//     if (slotIndex < (this.selectionStartIndex ?? 0)) {
//       this.selectionStartIndex = slotIndex;
//       this.selectionEndIndex = slotIndex;
//       return;
//     }
//
//     // втори клик напред -> фиксираме интервала и отваряме диалог
//     this.selectionEndIndex = slotIndex;
//
//     const startIdx = this.selectionStartIndex!;
//     const endIdx = this.selectionEndIndex!;
//
//     const startSlot = this.timeSlots[startIdx];
//     const endSlot = this.timeSlots[endIdx];
//
//     this.pendingSpace = spaceNumber;
//     this.pendingStart = startSlot.start;
//     this.pendingEnd = endSlot.end;
//
//     const totalPrice = this.calculateTotalPrice(this.pendingStart, this.pendingEnd);
//
//     this.dialogData = {
//       parkingName: this.parkingMeta.name,
//       spaceNumber: spaceNumber,
//       startTime: this.pendingStart,
//       endTime: this.pendingEnd,
//       totalPrice: totalPrice,
//       cardPaymentEnabled: this.parkingMeta.cardPaymentEnabled
//     };
//
//     this.dialogVisible = true;
//   }
//
//   onDialogCancel(): void {
//     this.dialogVisible = false;
//     this.dialogData = null;
//     this.clearSelection();
//   }
//
//   onDialogConfirm(event: { paymentMethod: 'cash' | 'card' }): void {
//     if (!this.pendingStart || !this.pendingEnd || !this.pendingSpace) {
//       this.onDialogCancel();
//       return;
//     }
//
//     const totalPrice = this.calculateTotalPrice(this.pendingStart, this.pendingEnd);
//
//     const bookingData = {
//       parkingId: this.parkingId,
//       spaceNumber: this.pendingSpace,
//       startTime: this.pendingStart.toISOString(),
//       endTime: this.pendingEnd.toISOString(),
//     };
//
//     if (event.paymentMethod === 'card') {
//       this.dialogVisible = false;
//
//       this.router.navigate(['/payment'],
//         { state: { bookingDetails: bookingData, totalPrice } });
//
//       this.clearSelection();
//       return;
//     }
//
//     this.dataService.createParkingBooking(this.parkingId, bookingData)
//       .subscribe({
//         next: (created) => {
//           this.bookings.push(created);
//           this.onDialogCancel();
//         },
//         error: (err) => {
//           alert('Резервацията не може да бъде създадена.');
//           console.error(err);
//           this.onDialogCancel();
//         }
//       });
//   }
//
//   clearSelection(): void {
//     this.selectionSpace = null;
//     this.selectionStartIndex = null;
//     this.selectionEndIndex = null;
//   }
//
//   isSelected(spaceNumber: number, slotIndex: number): boolean {
//     if (this.selectionSpace === null ||
//       this.selectionStartIndex === null ||
//       this.selectionEndIndex === null) {
//       return false;
//     }
//     if (spaceNumber !== this.selectionSpace) {
//       return false;
//     }
//     return slotIndex >= this.selectionStartIndex && slotIndex <= this.selectionEndIndex;
//   }
//
//   changeDate(offsetDays: number): void {
//     const d = new Date(this.selectedDate);
//     d.setDate(d.getDate() + offsetDays);
//     this.selectedDate = d;
//     this.clearSelection();
//     this.buildTimeSlots();
//     this.loadBookings();
//
//   }
// }
//
// interface TimeSlot {
//   label: string; // "08:00"
//   start: Date;
//   end: Date;
// }

import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, BookingConfirmDialogComponent],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.css'
})
export class SchedulerComponent implements OnInit {

  parkingId!: number;
  parkingMeta!: ParkingScheduleMeta;
  selectedDate: Date = new Date();
  spaces: number[] = [];
  timeSlots: TimeSlot[] = [];
  bookings: BookingSlot[] = [];
  loading = false;
  error: string | null = null;

  // селекция
  selectionSpace: number | null = null;
  selectionStartIndex: number | null = null;
  selectionEndIndex: number | null = null;

  // диалог
  dialogVisible = false;
  dialogData: BookingPreviewData | null = null;
  pendingSpace: number | null = null;
  pendingStart: Date | null = null;
  pendingEnd: Date | null = null;

  // информация за бонуси за текущия паркинг
  loyaltyInfo: LoyaltySummary | null = null;

  readonly BGN_TO_EUR = 1.95583;

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

  // ---------- helpers за форматиране на време ----------

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

  // ---------- логика за клик по слот ----------

  onSlotClick(spaceNumber: number, slot: TimeSlot, slotIndex: number): void {
    if (this.isPast(slot)) {
      return;
    }
    const existing = this.isBooked(spaceNumber, slot);
    if (existing) {
      return;
    }

    // ако няма селекция – започваме от този слот
    if (this.selectionSpace === null) {
      this.selectionSpace = spaceNumber;
      this.selectionStartIndex = slotIndex;
      this.selectionEndIndex = slotIndex;
      return;
    }

    // друго място – нова селекция
    if (this.selectionSpace !== spaceNumber) {
      this.selectionSpace = spaceNumber;
      this.selectionStartIndex = slotIndex;
      this.selectionEndIndex = slotIndex;
      return;
    }

    // ако кликнем по-рано от текущото начало – местим началото
    if (slotIndex < (this.selectionStartIndex ?? 0)) {
      this.selectionStartIndex = slotIndex;
      this.selectionEndIndex = slotIndex;
      return;
    }

    // втори/трети клик напред
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

  // --------------------------------------------

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

    // 1) Ако крайната цена е 0 → никакво плащане, директно създаваме букинг
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

    // 2) Плащане с карта (цена > 0) → към /payment с намалената сума
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

    // 3) Плащане в брой (цена > 0)
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
  }
}

interface TimeSlot {
  label: string;
  start: Date;
  end: Date;
  hour: number;
}
