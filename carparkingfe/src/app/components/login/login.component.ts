import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {JwtService} from "../../services/jwt.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private service: JwtService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    })
  }

  submitForm() {
    this.service.login(this.loginForm.value).subscribe(
      (response) => {
        console.log('Response:', response);
        if (response.jwtToken != null) {
          alert("Hello, Your token is " + response.jwtToken);
          const jwtToken = response.jwtToken;
          localStorage.setItem('jwtToken', jwtToken);
          console.log('JWT Token set in localStorage:', localStorage.getItem('jwtToken'));
          console.log('Navigating to /scheduler');
          this.router.navigateByUrl("/scheduler"); // Пренасочване след успешен логин
        }
      },
      (error) => {
        console.log('Login failed', error);
        alert('Login failed: ' + error.message);
      }
    );
  }
}
