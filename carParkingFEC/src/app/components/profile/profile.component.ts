import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {DataService} from "../../service/data.service";
import {CommonModule} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {ParkingListComponent} from "../parking-list/parking-list.component";
import {ParkingHome} from "../home/home.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, ParkingListComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: string | null = null;
  isAdmin: boolean = false;
  parkings: ParkingHome[] = [];

  constructor(private router: Router, private ds: DataService) {
  }

  ngOnInit(): void {
    this.currentUser = this.ds.getCurrentUser();
    this.ds.getUserRole().subscribe((response: { role: string }) => {
      this.isAdmin = response.role === 'ADMIN';
    });
    this.ds.getParkingsForHome().subscribe({
      next: res => this.parkings = res,
      error: err => console.error(err)
    });
  }

  logout() {
    this.ds.logout();
    this.router.navigate(['/home']);
  }
}
