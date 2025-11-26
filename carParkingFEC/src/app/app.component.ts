import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {HomeComponent} from "./components/home/home.component";
import {HttpClientModule} from "@angular/common/http";
import {SchedulerComponent} from "./components/scheduler/scheduler.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProfileEditComponent} from "./components/profile-edit/profile-edit.component";
import {MybookingsComponent} from "./components/mybookings/mybookings.component";
import {QuickBookingComponent} from "./components/quick-booking/quick-booking.component";
import {BookingSuccessComponent} from "./components/booking-success/booking-success.component";
import {AllbookingsComponent} from "./components/allbookings/allbookings.component";
import {AllprofilesComponent} from "./components/allprofiles/allprofiles.component";
import {ForgotpasswordComponent} from "./components/forgotpassword/forgotpassword.component";
import {ResetpasswordComponent} from "./components/resetpassword/resetpassword.component";
import {DataService} from "./service/data.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HomeComponent, RouterLink,
    RouterLinkActive, HttpClientModule, SchedulerComponent, LoginComponent,
    RegisterComponent, PaymentComponent,
    ProfileComponent, ProfileEditComponent, MybookingsComponent, QuickBookingComponent,
    BookingSuccessComponent, AllbookingsComponent, AllprofilesComponent, ForgotpasswordComponent, ResetpasswordComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  showNavbar = false;
  isAdmin = false;

  private hideNavBarOn: string[] = [
    '/',
    '',
    '/login',
    '/register',
    '/quick-booking',
    '/booking-success',
    '/forgot-password',
    '/reset-password'
  ]

  constructor(private router: Router, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.showNavbar = this.shouldShowNavbar(url);
        if (this.dataService.isLoggedIn()) {
          this.loadUserRole();
        } else {
          this.isAdmin = false;
        }
      });
  }

  logout(): void {
    this.dataService.logout();
    this.router.navigate(['/home']);
  }

  private shouldShowNavbar(url: string): boolean {
    if (this.hideNavBarOn.includes(url)) {
      return false;
    }
    return this.dataService.isLoggedIn();
  }

  private loadUserRole(): void {
    this.dataService.getUserRole().subscribe({
      next: res => {
        this.isAdmin = res.role === 'ADMIN';
      },
      error: () => {
        this.isAdmin = false;
      }
    });
  }

  title = 'ParkWise';
}
