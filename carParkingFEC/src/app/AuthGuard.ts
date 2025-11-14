import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {DataService} from "./service/data.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private dataService: DataService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.dataService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }


  // private getCookieValue(name: string): string | null {
  //   const cookies = document.cookie.split(';');
  //   for (const cookie of cookies) {
  //     const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
  //     if (cookieName === name) {
  //       return decodeURIComponent(cookieValue);
  //     }
  //   }
  //   return null;
  // }
}
