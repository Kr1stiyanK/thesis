import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  changePasswordForm: FormGroup;
  showEmailForm = false;
  showPasswordForm = false;

  constructor(
    private fb: FormBuilder,
    private service: DataService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      currentEmail: ['', [Validators.required, Validators.email]],
      newEmail: ['', [Validators.required, Validators.email]]
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const currentUser = this.service.getCurrentUser();
    this.profileForm.patchValue({
      currentEmail: currentUser
    });
  }

  updateEmail() {
    if (this.profileForm.valid) {
      this.service.changeEmail(this.profileForm.value).subscribe(
        (response: any) => {
          alert('Имейлът е променен успешно. Моля, влез с новия имейл.');
          this.service.logout();
          this.router.navigate(['/login']);
        },
        (error: any) => {
          alert('Неуспешна смяна на имейл: ' + error.message);
        }
      );
    }
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const email = this.service.getCurrentUser();
      const passwordData = {
        email: email!,
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword
      };
      this.service.changePassword(passwordData).subscribe(
        (response: any) => {
          alert('Паролата е променена успешно. Моля, влез с новата парола.');
          this.service.logout();
          this.router.navigate(['/login']);
        },
        (error: any) => {
          alert('Неуспешна смяна на парола: ' + error.message);
        }
      );
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : {mismatch: true};
  }
}
