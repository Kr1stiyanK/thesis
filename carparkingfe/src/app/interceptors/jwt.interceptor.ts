import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private static isLocalStorageAvailable(): boolean {
    try {
      const test = 'localStorageTest';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Извличане на JWT токена от localStorage
    const token = localStorage.getItem('jwtToken');

    // Ако токенът съществува, добави го към заглавието на заявката
    if (token) {
      console.log(token);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(request);
    }

    // Продължи с обработката на заявката
    return next.handle(request);
  }
}
