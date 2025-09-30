import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SchedulerComponent} from "../components/scheduler/scheduler.component";
import {DayPilotModule} from "daypilot-pro-angular";
import {HttpClientModule} from "@angular/common/http";
import {JwtService} from "../services/jwt.service";


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DayPilotModule],
  declarations: [SchedulerComponent],
  exports: [SchedulerComponent],
  providers: [JwtService]
})
export class SchedulerModule {
}
