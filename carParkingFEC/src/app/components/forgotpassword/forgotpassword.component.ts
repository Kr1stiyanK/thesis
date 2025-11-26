import {Component} from '@angular/core';
import {DataService} from "../../service/data.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  forgotPasswordForm: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submitForm() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const email = this.forgotPasswordForm.value.email;

    this.dataService.requestPasswordReset(email).subscribe({
      next: () => {
        this.submitting = false;
        alert('Изпратихме линк за смяна на паролата. Моля, провери имейла си.');
      },
      error: (err) => {
        console.error(err);
        this.submitting = false;
        alert('Ако този имейл е регистриран, ще получите съобщение с инструкции.');
      }
    });
  }
}


