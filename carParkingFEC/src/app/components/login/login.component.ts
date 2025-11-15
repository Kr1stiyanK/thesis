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

  constructor(
    private service: DataService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this
      .loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
  }

  submitForm() {
    this.service.login(this.loginForm.value).subscribe(
      (response) => {
        if (response.jwtToken != null) {
          const jwtToken = response.jwtToken;
          localStorage.setItem('jwtToken', jwtToken);

          const target = this.redirectUrl || '/profile';
          this.router.navigateByUrl(target);
        }
      },
      (error) => {
        alert('Login failed: ' + error.message);
      }
    );
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  }


}
