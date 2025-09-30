import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component"
import {RegisterComponent} from "./components/register/register.component";
import {ParkingTableComponent} from "./components/parking-table/parking-table.component";
import {MainComponent} from "./components/main/main.component";
import {BookingDialogComponent} from "./components/booking-dialog/booking-dialog.component";
import {SchedulerComponent} from "./components/scheduler/scheduler.component";


export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'main', component: MainComponent, children: [
      {path: 'booking-dialog', component: BookingDialogComponent}
    ]
  },
  {path: 'scheduler', component: SchedulerComponent},
];
