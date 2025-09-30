import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DayPilot} from "daypilot-pro-angular";


const BASE_URL = ["http://localhost:8081/"]

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private http: HttpClient) {
  }

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'register', signRequest)
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'login', loginRequest)
  }


  getParkingSpaces(): Observable<any> {
    const headers = JwtService.createAuhtorizationHeader();
    return this.http.get(BASE_URL + 'api/parkingspaces', {headers}) as Observable<any>;
  }

  private static createAuhtorizationHeader(): HttpHeaders {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      console.log("JWT token found in local storage", jwtToken);
      return new HttpHeaders().set(
        "Authorization", "Bearer " + jwtToken
      )
    } else {
      console.log("JWT token not found in local storage");
      return new HttpHeaders();
    }
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {
    const headers = JwtService.createAuhtorizationHeader();
    return this.http.get<any[]>(BASE_URL + `api/events?from=${from.toString()}&to=${to.toString()}`, {headers});
  }

  // getResources(): Observable<any[]> {
  //   const headers = JwtService.createAuhtorizationHeader();
  //   console.log('prashta API call, vsichko e okal');
  //   return this.http.get(BASE_URL + 'api/parkingspaces', {headers}) as Observable<any>;
  // }

  getResources(): Observable<any[]> {
    const headers = JwtService.createAuhtorizationHeader();
    return this.http.get(BASE_URL + "api/resources", {headers}) as Observable<any>;
  }

  createEvent(data: EventCreateParams): Observable<EventData> {
    return this.http.post("/api/events/create", data) as Observable<any>;
  }

  moveEvent(data: EventMoveParams): Observable<EventData> {
    return this.http.post("/api/events/move", data) as Observable<any>;
  }

  deleteEvent(data: EventDeleteParams): Observable<EventData> {
    return this.http.post("/api/events/delete", data) as Observable<any>;
  }

  bookParkingSpace(booking: any): Observable<any> {
    const headers = JwtService.createAuhtorizationHeader();
    return this.http.post(BASE_URL + '/book', booking, {headers});
  }

}

export interface EventCreateParams {
  start: string;
  end: string;
  text: string;
  resource: string | number;
}

export interface EventMoveParams {
  id: string | number;
  start: string;
  end: string;
  resource: string | number;
}

export interface EventDeleteParams {
  id: string | number;
}

export interface EventData {
  id: string | number;
  start: string;
  end: string;
  text: string;
  resource: string | number;
}

