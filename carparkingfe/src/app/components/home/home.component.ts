import {Component} from '@angular/core';
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: `./home.component.css`
})
export class HomeComponent {
  constructor(private router: Router) {
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
