import {Component} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component"
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RegisterComponent} from "./components/register/register.component";
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {DayPilot, DayPilotModule, DayPilotSchedulerComponent} from "daypilot-pro-angular";
import {SchedulerComponent} from "./components/scheduler/scheduler.component";
import {SchedulerModule} from "./scheduler/scheduler.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, LoginComponent, CommonModule, FormsModule, RouterModule, RegisterComponent, HttpClientModule,SchedulerComponent],
  templateUrl: './app.component.html',
  styles: [`/*.container {*/
/*    display: flex;*/
/*    flex-direction: column;*/
/*    align-items: center;*/
/*    justify-content: center;*/
/*    height: 100vh;*/
/*    text-align: center;*/
/*  }*/

/*  h1 {*/
/*    margin-bottom: 20px;*/
/*  }*/

/*  .buttons {*/
/*    display: flex;*/
/*    gap: 10px;*/
/*  }*/

/*  button {*/
/*    padding: 10px 20px;*/
/*    font-size: 16px;*/
/*    cursor: pointer;*/
/*  }*/
  `]
})
export class AppComponent {
  title = 'carparkingfe';
}
