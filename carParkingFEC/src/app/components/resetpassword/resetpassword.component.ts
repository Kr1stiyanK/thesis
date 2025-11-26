import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DataService} from "../../service/data.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent implements OnInit{
  resetPasswordForm: FormGroup;
  token: string | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required], Validators.minLength(4)],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      alert('Липсва токен за смяна на парола.');
      this.router.navigate(['/login']);
    }
  }

  submit(): void {
    if (this.resetPasswordForm.invalid || !this.token) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    const {password, confirmPassword} = this.resetPasswordForm.value;
    if (password !== confirmPassword) {
      alert('Паролите не съвпадат.');
      return;
    }

    this.dataService.resetPassword(this.token, password).subscribe({
      next: () => {
        alert('Паролата беше променена успешно.');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error(err);
        alert(err?.error || 'Грешка при смяната на паролата.');
      }
    });
  }

}
