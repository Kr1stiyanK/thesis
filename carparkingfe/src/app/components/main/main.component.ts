import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ParkingTableComponent} from '../parking-table/parking-table.component';
import {SchedulerComponent} from "../scheduler/scheduler.component";
import {DayPilotModule, DayPilotSchedulerComponent} from "daypilot-pro-angular";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, CommonModule, SchedulerComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
