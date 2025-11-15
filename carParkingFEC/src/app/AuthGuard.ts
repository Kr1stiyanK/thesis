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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.dataService.isLoggedIn()) {
      return true;
    } else {
      // 👇 подаваме URL-а, към който първоначално е искал да отиде
      this.router.navigate(['/login'], {
        queryParams: {redirectUrl: state.url}
      });
      return false;
    }
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
