import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA, DoCheck,
  ElementRef,
  Inject, OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {DayPilot, DayPilotModule, DayPilotSchedulerComponent} from "daypilot-pro-angular";
import {EventCreateParams, EventDeleteParams, EventMoveParams, JwtService} from "../../services/jwt.service";
import {CommonModule, isPlatformBrowser} from "@angular/common";
import SchedulerBeforeRowHeaderRenderArgs = DayPilot.SchedulerBeforeRowHeaderRenderArgs;
import SchedulerBeforeResHeaderRenderArgs = DayPilot.SchedulerBeforeResHeaderRenderArgs;
import {SchedulerModule} from "../../scheduler/scheduler.module";

@Component({
  selector: 'app-scheduler',
  template: `
    <div class="body" style="height: 500px">
      <h1>Scheduler</h1>
      <daypilot-scheduler [config]="config" [events]="events"></daypilot-scheduler>
    </div>`,
  styles: [`.body {
    padding: 10px;
  }
  `]
})
export class SchedulerComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  // @ViewChild('scheduler') scheduler: any;
  // events: any[] = [];
  // config: any = {
  //   timeHeaders: [
  //     { groupBy: 'Day', format: 'MMMM d, yyyy' },
  //     { groupBy: 'Hour' },
  //   ],
  //   scale: 'Hour',
  //   days: new Date().getDate(),
  //   startDate: new Date().setDate(1),
  //   businessBeginsHour: 8,
  //   businessEndsHour: 20,
  //   cellDuration: 60,
  //   showNonBusiness: false,
  //   resources: [],
  // };
  //
  // isBrowser: boolean;
  //
  // constructor(
  //   @Inject(PLATFORM_ID) private platformId: object,
  //   private parkingService: JwtService,
  //   private dialog: MatDialog
  // ) {
  //   this.isBrowser = isPlatformBrowser(platformId);
  // }
  //
  // async ngOnInit(): Promise<void> {
  //   if (this.isBrowser) {
  //     const { DayPilot, DayPilotSchedulerComponent } = await import(
  //       'daypilot-pro-angular'
  //       );
  //     this.scheduler = DayPilotSchedulerComponent;
  //     this.loadResources();
  //     this.loadEvents();
  //   }
  // }
  //
  // ngAfterViewInit(): void {
  //   if (this.isBrowser) {
  //     this.loadResources();
  //     this.loadEvents();
  //   }
  // }
  //
  // loadResources(): void {
  //   if (this.isBrowser) {
  //     this.parkingService.getParkingSpaces().subscribe((data: any[]) => {
  //       this.config.resources = data.map((space) => ({
  //         name: space.parkSpaceName,
  //         id: space.id,
  //       }));
  //     });
  //   }
  // }
  //
  // loadEvents(): void {
  //   if (this.isBrowser) {
  //     const from = this.scheduler.control.visibleStart();
  //     const to = this.scheduler.control.visibleEnd();
  //     this.parkingService.getEvents(from, to).subscribe((result: any[]) => {
  //       this.events = result;
  //     });
  //   }
  // }
  //
  // openBookingDialog(args: any): void {
  //   const dialogRef = this.dialog.open(BookingDialogComponent, {
  //     width: '300px',
  //     data: { resource: args.resource, start: args.start },
  //   });
  //
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.parkingService.bookParkingSpace(result).subscribe(() => {
  //         this.loadEvents();
  //       });
  //     }
  //   });
  // }

  // @ViewChild("scheduler") scheduler!: DayPilotSchedulerComponent;
  //
  // events: DayPilot.EventData[] = [];
  //
  // config: DayPilot.SchedulerConfig = {
  //   timeHeaders: [
  //     {groupBy: "Month", format: "MMMM yyyy"},
  //     {groupBy: "Day", format: "MMMM d"},
  //     {groupBy: "Hour"}
  //   ],
  //   startDate: DayPilot.Date.today().firstDayOfYear(),
  //   days: DayPilot.Date.today().daysInYear(),
  //   scale: "Hour",
  //   rowHeaderColumns: [
  //     {text: 'Storage Box', width: 100},
  //     {text: 'Capacity', width: 60, display: "capacity"},
  //     {text: 'Status', width: 50},
  //     // { text: 'ParkSpace', width: 100 }
  //   ],
  //   onBeforeRowHeaderRender: args => {
  //     args!.row.columns[1].horizontalAlignment = "center";
  //     if (args!.row.data.status === "locked") {
  //       args!.row.columns[2].areas = [
  //         {
  //           left: "calc(50% - 8px)",
  //           top: 10,
  //           width: 20,
  //           height: 20,
  //           symbol: "/assets/daypilot.svg#padlock",
  //           fontColor: "#777777"
  //         }
  //       ];
  //     }
  //   },
  //   onBeforeEventRender: args => {
  //     args!.data.barColor = "#cc004c";
  //     args!.data.areas = [
  //       {
  //         right: 5,
  //         top: 7,
  //         width: 24,
  //         height: 24,
  //         symbol: "/assets/daypilot.svg#x-circle",
  //         fontColor: "#777777",
  //         toolTip: "Delete",
  //         onClick: (args: any) => {
  //           const e = args!.source;
  //           const params: EventDeleteParams = {
  //             id: e.id(),
  //           };
  //           this.ds.deleteEvent(params).subscribe(result => {
  //             this.scheduler.control.events.remove(e);
  //             this.scheduler.control.message("Event deleted");
  //           });
  //         }
  //       },
  //     ];
  //   },
  //   onTimeRangeSelected: args => {
  //     DayPilot.Modal.prompt("New event name:", "Event").then(modal => {
  //       this.scheduler.control.clearSelection();
  //       if (!modal.result) {
  //         return;
  //       }
  //
  //       let params: EventCreateParams = {
  //         start: args!.start.toString(),
  //         end: args!.end.toString(),
  //         text: modal.result,
  //         resource: args!.resource
  //       };
  //       this.ds.createEvent(params).subscribe(result => {
  //         this.events.push(result);
  //         this.scheduler.control.message("Event created");
  //       });
  //
  //     });
  //   },
  //   onEventMove: args => {
  //     let params: EventMoveParams = {
  //       id: args!.e.id(),
  //       start: args!.newStart.toString(),
  //       end: args!.newEnd.toString(),
  //       resource: args!.newResource
  //     };
  //     this.ds.moveEvent(params).subscribe(result => {
  //       this.scheduler.control.message("Event moved");
  //     });
  //   }
  // };
  //
  // constructor(private ds: JwtService) {
  // }
  //
  // ngAfterViewInit(): void {
  //   var temp = this.ds.getResources();
  //   console.log(temp);
  //
  //   this.ds.getResources().subscribe(result => {
  //     this.config.resources = result
  //   });
  //   console.log("e tuk vliza")
  //   var from = this.scheduler.control.visibleStart();
  //   var to = this.scheduler.control.visibleEnd();
  //   this.ds.getEvents(from, to).subscribe(result => this.events = result);
  //
  //   this.scheduler.control.scrollTo(DayPilot.Date.today());
  //
  // }


  // @ViewChild('scheduler') scheduler!: DayPilotSchedulerComponent;
  //
  // events: DayPilot.EventData[] = [];
  //
  // config: DayPilot.SchedulerConfig = {
  //   timeHeaders: [
  //     {groupBy: 'Month', format: 'MMMM yyyy'},
  //     {groupBy: 'Day', format: 'MMMM d'},
  //     {groupBy: 'Hour'}
  //   ],
  //   startDate: DayPilot.Date.today().firstDayOfYear(),
  //   days: DayPilot.Date.today().daysInYear(),
  //   scale: 'Hour',
  //   rowHeaderColumns: [
  //     {text: 'Storage Box', width: 100},
  //     {text: 'Capacity', width: 60, display: 'capacity'},
  //     {text: 'Status', width: 50},
  //   ],
  //   onBeforeRowHeaderRender: (args) => {
  //     if (args !== undefined) {
  //       args.row.columns[1].horizontalAlignment = 'center';
  //       if (args.row.data.status === 'locked') {
  //         args.row.columns[2].areas = [
  //           {
  //             left: 'calc(50% - 8px)',
  //             top: 10,
  //             width: 20,
  //             height: 20,
  //             symbol: '/assets/daypilot.svg#padlock',
  //             fontColor: '#777777',
  //           },
  //         ];
  //       }
  //     }
  //   },
  //   onBeforeEventRender: (args) => {
  //     args!.data.barColor = '#cc004c';
  //     args!.data.areas = [
  //       {
  //         right: 5,
  //         top: 7,
  //         width: 24,
  //         height: 24,
  //         symbol: '/assets/daypilot.svg#x-circle',
  //         fontColor: '#777777',
  //         toolTip: 'Delete',
  //         onClick: (args: any) => {
  //           const e = args!.source;
  //           const params = {id: e.id()};
  //           this.ds.deleteEvent(params).subscribe(() => {
  //             this.scheduler.control.events.remove(e);
  //             this.scheduler.control.message('Event deleted');
  //           });
  //         },
  //       },
  //     ];
  //   },
  //   onTimeRangeSelected: (args) => {
  //     DayPilot.Modal.prompt('New event name:', 'Event').then((modal) => {
  //       this.scheduler.control.clearSelection();
  //       if (!modal.result) return;
  //       const params = {
  //         start: args!.start.toString(),
  //         end: args!.end.toString(),
  //         text: modal.result,
  //         resource: args!.resource,
  //       };
  //       this.ds.createEvent(params).subscribe((result) => {
  //         this.events.push(result);
  //         this.scheduler.control.message('Event created');
  //       });
  //     });
  //   },
  //   onEventMove: (args) => {
  //     const params = {
  //       id: args!.e.id(),
  //       start: args!.newStart.toString(),
  //       end: args!.newEnd.toString(),
  //       resource: args!.newResource,
  //     };
  //     this.ds.moveEvent(params).subscribe(() => {
  //       this.scheduler.control.message('Event moved');
  //     });
  //   },
  // };
  //
  // constructor(private ds: JwtService) {
  // }

  // ngAfterViewInit(): void {
  // this.ds.getResources().subscribe((result) => {
  //   this.config.resources = result.map((r: any) => ({
  //     id: r.id,
  //     name: r.parkSpaceName,
  //     status: "free", // You can adjust this field based on your data
  //     capacity: 1     // You can adjust this field based on your data
  //   }));
  //   const from = this.scheduler.control.visibleStart();
  //   const to = this.scheduler.control.visibleEnd();
  //   this.ds.getEvents(from, to).subscribe((events) => (this.events = events));
  //   this.scheduler.control.scrollTo(DayPilot.Date.today());
  // });
  //   this.ds.getResources().subscribe(result => this.config.resources = result);
  // }

  // @ViewChild('scheduler')
  // scheduler!: DayPilotSchedulerComponent;
  //
  //
  // events: DayPilot.EventData[] = [];
  //
  // config: DayPilot.SchedulerConfig = {
  //   timeHeaders: [
  //     {groupBy: "Month", format: "MMMM yyyy"},
  //     {groupBy: "Day", format: "d"}
  //   ],
  //   startDate: DayPilot.Date.today().firstDayOfYear(),
  //   days: DayPilot.Date.today().daysInYear(),
  //   scale: "Day",
  //   rowHeaderColumns: [
  //     {text: 'Storage Box', width: 100},
  //     {text: 'Capacity', width: 60, display: "capacity"},
  //     {text: 'Status', width: 50},
  //   ]
  // }
  config: any;
  events: any[] = [];

  constructor() {
    this.config = {
      startDate: DayPilot.Date.today(),
      days: 7,
      scale: "Day",
      timeHeaders: [{groupBy: "Day", format: "dddd, MMMM d, yyyy"}],
      resources: [
        {name: "Resource A", id: "A"},
        {name: "Resource B", id: "B"},
        {name: "Resource C", id: "C"}
      ],
      heightSpec: "Full" // задава динамична височина
    };

    this.events = [
      {
        id: "1",
        text: "Event 1",
        start: DayPilot.Date.today().addHours(10),
        end: DayPilot.Date.today().addHours(12),
        resource: "A"
      },
      {
        id: "2",
        text: "Event 2",
        start: DayPilot.Date.today().addHours(15),
        end: DayPilot.Date.today().addHours(17),
        resource: "B"
      }
    ];
  }


  //constructor(private ds: JwtService) {
  // if (this.scheduler != null || undefined) {
  //   console.log('kura e oshte po-golqm');
  // } else {
  //   console.log('kur');
  // }
  // this.ds.getResources().subscribe(result => this.config.resources = result);
  //}

  ngAfterViewInit(): void {
    // if (this.scheduler != null || undefined) {
    //   console.log('kur');
    //   console.log(this.scheduler);
    // } else {
    //   console.log('kura e oshte po-golqm');
    // }
    // this.scheduler.control.message("Welcome!");
    // console.log(this.scheduler.control);
    // console.log(this.scheduler.config);
    // console.log(this.scheduler.events);
    // this.ds.getResources().subscribe(result => this.config.resources = result);
    // console.log('eee she ti eba maikata');

    // var from = this.scheduler.control.visibleStart();
    // var to = this.scheduler.control.visibleEnd();
    // this.ds.getEvents(from, to).subscribe(result => this.events = result);

    // this.scheduler.control.scrollTo(DayPilot.Date.today());

  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
  }

  ngOnDestroy(): void {
  }


}


