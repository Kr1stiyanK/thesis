import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {DataService} from "../../service/data.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  private redirectUrl: string | null = null;
  parkingIdFromHome: number | null = null;

  constructor(
    private service: DataService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
    const pid = this.route.snapshot.queryParamMap.get('parkingId');
    this.parkingIdFromHome = pid ? Number(pid) : null;
  }

  // submitForm() {
  //   this.service.login(this.loginForm.value).subscribe(
  //     (response) => {
  //       if (response.jwtToken != null) {
  //         const jwtToken = response.jwtToken;
  //         localStorage.setItem('jwtToken', jwtToken);
  //
  //         const target = this.redirectUrl || '/profile';
  //         this.router.navigate([target],{queryParams: {parkingId: this.parkingIdFromHome}});
  //       }
  //     },
  //     (error) => {
  //       alert('Login failed: ' + error.message);
  //     }
  //   );
  //
  //
  //   this.service.login(this.loginForm.value).subscribe({
  //     next: () => {
  //       // ако сме дошли от "Резервирай тук" → директно към графика на този паркинг
  //       if (this.parkingIdFromHome) {
  //         this.router.navigate(['/scheduler'], {
  //           queryParams: {parkingId: this.parkingIdFromHome}
  //         });
  //       } else {
  //         this.router.navigate(['/profile']);
  //       }
  //     },
  //     error: err => {
  //       console.error(err);
  //       alert('Грешка при вход.');
  //     }
  //   });
  // }
  submitForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.service.login(this.loginForm.value).subscribe({
      next: (response) => {
        const jwtToken = response?.jwtToken;
        if (!jwtToken) {
          alert('Възникна грешка при вход.');
          return;
        }
        localStorage.setItem('jwtToken', jwtToken);

        let target = '/profile';
        let extras: any = {};

        if (this.redirectUrl) {
          target = this.redirectUrl;
          if (this.parkingIdFromHome) {
            extras = { queryParams: { parkingId: this.parkingIdFromHome } };
          }
        } else if (this.parkingIdFromHome) {
          target = '/scheduler';
          extras = { queryParams: { parkingId: this.parkingIdFromHome } };
        }

        this.router.navigate([target], extras);
      },
      error: (error) => {
        const msg = error?.error?.message;

        if (msg === 'USER_NOT_ENABLED') {
          alert('Профилът Ви не е активиран. Моля, проверете имейла си.');
          return;
        }

        if (msg === 'INVALID_CREDENTIALS') {
          alert('Грешен имейл или парола.');
          return;
        }

        alert('Възникна грешка при вход.');
      }
    });
  }

  goToQuickBooking() {
    if (this.parkingIdFromHome) {
      this.router.navigate(['/quick-booking'], {
        queryParams: {parkingId: this.parkingIdFromHome}
      });
    } else {
      this.router.navigate(['/quick-booking']);
    }
  }
}
