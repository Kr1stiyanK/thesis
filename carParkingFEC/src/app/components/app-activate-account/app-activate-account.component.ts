import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-app-activate-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-activate-account.component.html',
  styleUrl: './app-activate-account.component.css'
})
export class AppActivateAccountComponent implements OnInit {
  loading = true;
  message = '';

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading = false;
      this.message = 'Липсва токен за активация.';
      return;
    }
    this.dataService.verifyAccount(token).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Профилът е успешно активиран. Можете да влезете в системата.';
      },
      error: (err) => {
        this.loading = false;
        const backendMsg = err?.error || 'Линкът е невалиден, изтекъл или вече използван.';
        this.message = backendMsg;
      }
    });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
