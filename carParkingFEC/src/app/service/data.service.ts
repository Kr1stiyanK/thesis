import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {DayPilot} from 'daypilot-pro-angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {ParkingHome} from "../components/home/home.component";

const BASE_URL = 'http://localhost:8081/';

@Injectable()
export class DataService {

  constructor(private http: HttpClient, private router: Router) {
  }

  private static createAuthorizationHeader(): HttpHeaders {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
      });
    } else {
      console.log("JWT token not found in local storage");
      return new HttpHeaders();
    }
  }

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'register', signRequest)
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'login', loginRequest)
  }

  verifyAccount(token: string): Observable<void> {
    return this.http.get<void>(BASE_URL + 'api/auth/verify', {params: {token}});
  }

  getResources(): Observable<any[]> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<any[]>(BASE_URL + 'api/parkingspaces', {headers});
  }

  createEvent(data: EventCreateParams): Observable<any> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.post<any>(BASE_URL + 'api/parkingspaces/create', data, {headers});
  }

  updateEvent(data: EventEditParams): Observable<any> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.post<any>(BASE_URL + 'api/parkingspaces/edit', data, {headers});
  }

  checkParkingSpaceAvailability(data: CheckAvailabilityParams): Observable<{ available: boolean }> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.post<{ available: boolean }>(BASE_URL + 'api/parkingspaces/check-availability', data, {headers});
  }

  getUserRole(): Observable<{ role: string }> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<{ role: string }>(BASE_URL + 'api/role', {headers});
  }

  isLoggedIn(): boolean {
    const jwtToken = localStorage.getItem('jwtToken');
    return !!jwtToken;
  }

  getCurrentUser(): string | null {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const payload = JSON.parse(atob(token!.split('.')[1]));
      return payload.sub;
    }
    return null;
  }

  getCurrentUserObservable(): Observable<number | null> {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return of(payload.userId);
    }
    return of(null);
  }


  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('expires_at');
    // this.deleteCookie('JSESSIONID');
    // this.deleteCookie('jwtToken');

    // this.http.post(BASE_URL + 'logout', {})
    //   .subscribe({
    //     next: () => {
          this.router.navigate(['/home']);
      //   }
      // });
  }


  // deleteCookie(name: string) {
  //   document.cookie = `${name}=; Path=/; Max-Age=0;`;
  // }

  changeEmail(updateEmailRequest: any): Observable<any> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.put(BASE_URL + 'api/update-email', updateEmailRequest, {headers}).pipe(
      catchError(error => {
        console.error('Update email error:', error);
        return throwError(error);
      })
    );
  }

  changePassword(passwordData: { email: string, currentPassword: string, newPassword: string }): any {
    const headers = DataService.createAuthorizationHeader();
    return this.http.put(BASE_URL + 'api/change-password', passwordData, {headers});
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(BASE_URL + 'api/forgotten-password', email);
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(BASE_URL + 'api/reset-password', {token, newPassword}, {responseType: 'text'});
  }

  getMyBookings(email: string): Observable<any[]> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<any[]>(`${BASE_URL}api/my-bookings?email=${email}`, {headers});
  }

  checkAvailability(data: { startTime: string, endTime: string }): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(BASE_URL + 'api/guest/check-availability', data, {headers});
  }

  quickBooking(bookingData: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(BASE_URL + 'api/guest/quick-booking', bookingData, {headers});
  }

  getAllProfiles(): Observable<any[]> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<any[]>(BASE_URL + 'api/admin/parkings/all-profiles', {headers});
  }

  getAllBookings(): Observable<any[]> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<any[]>(BASE_URL + 'api/all-bookings', {headers});
  }

  getFreeNow(): Observable<number> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<number>(BASE_URL + 'api/free-now', {headers});
  }

  getParkingsForHome(): Observable<ParkingHome[]>{
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.get<ParkingHome[]>(BASE_URL + 'api/parkings', {headers});
  }

  getMyParkings(): Observable<ParkingAdmin[]>{
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<ParkingAdmin[]>(BASE_URL + 'api/admin/parkings/my', {headers});
  }
  createParking(req: CreateParkingRequest): Observable<ParkingAdmin> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.post<ParkingAdmin>(BASE_URL + 'api/admin/parkings', req, {headers});
  }

  updateParking(id: number, req: CreateParkingRequest): Observable<ParkingAdmin> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.put<ParkingAdmin>(BASE_URL + 'api/admin/parkings/' + id, req, { headers });
  }

  deleteParking(id: number): Observable<void> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.delete<void>(BASE_URL + 'api/admin/parkings/' + id, { headers });
  }

  getParkingScheduleMeta(parkingId: number): Observable<ParkingScheduleMeta> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<ParkingScheduleMeta>(BASE_URL + `api/parkings/${parkingId}/schedule-meta`, { headers });
  }

  getParkingBookings(parkingId: number, date: string): Observable<BookingSlot[]> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<BookingSlot[]>(BASE_URL + `api/parkings/${parkingId}/bookings?date=${date}`, { headers });
  }

  getAllBookingsForParking(parkingId: number) {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<AdminBookings[]>(`http://localhost:8081/api/admin/parkings/${parkingId}/bookings`, { headers });
  }


  getLoyaltyForParking(parkingId: number): Observable<LoyaltySummary> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<LoyaltySummary>(BASE_URL + 'api/loyalty/parking/' + parkingId, { headers });
  }

  getMyLoyalty(): Observable<LoyaltySummary[]> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.get<LoyaltySummary[]>(BASE_URL + 'api/loyalty/my', { headers });
  }

  createParkingBooking(parkingId: number, body: { spaceNumber: number; startTime: string; endTime: string }): Observable<BookingSlot> {
    const headers = DataService.createAuthorizationHeader();
    return this.http.post<BookingSlot>(BASE_URL + `api/parkings/${parkingId}/bookings`, body, { headers });
  }

  checkQuickBookingAvailability(parkingId: number, startTime: string, endTime: string) {
    return this.http.post<{ available: boolean }>(BASE_URL + `api/parkings/${parkingId}/bookings/quick-availability`, {parkingId, startTime, endTime});
  }

}

export interface EventCreateParams {
  start: string;
  end: string;
  text: string;
  resource: string | number;
  userId: string | number;
  amount: number;
}

export interface EventMoveParams {
  resourceId: number;
  startTime: string;
  endTime: string;
  bookingId: number;
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

export interface EventEditParams {
  id: string | number;
  start: string;
  end: string;
  resourceId: string | number;
  amount: number
}

export interface CheckAvailabilityParams {
  resourceId: number | null;
  startTime: string;
  endTime: string;
  bookingId: number | null;
}

export interface ParkingAdmin {
  id: number;
  name: string;
  address: string;
  city: string;
  spacesCount: number;
  pricePerHourBgn: number;
  cardPaymentEnabled: boolean;
  loyaltyEnabled: boolean;
  loyaltyVisitPerPoint?: number;
  loyaltyPointsRequired?: number;
  loyaltyRewardHours?: 'ONE_HOUR' | 'THREE_HOURS' | 'SIX_HOURS' | 'EIGHT_HOURS';
  mapImageUrl?: string;
  open24Hours: boolean;
  openingTime?: string;
  closingTime?: string;
  contactPhone?: string;
}

export interface CreateParkingRequest {
  name: string;
  address: string;
  city: string;
  spacesCount: number;
  pricePerHourBgn: number;
  cardPaymentEnabled: boolean;
  loyaltyEnabled: boolean;
  loyaltyVisitPerPoint?: number;
  loyaltyPointsRequired?: number;
  loyaltyRewardHours?: 'ONE_HOUR' | 'THREE_HOURS' | 'SIX_HOURS' | 'EIGHT_HOURS';
  mapImageUrl?: string;
  open24Hours: boolean;
  openingTime?: string;
  closingTime?: string;
  contactPhone?: string;
}

export interface ParkingScheduleMeta {
  id: number;
  name: string;
  spacesCount: number;
  open24Hours: boolean;
  openingTime?: string;  // "HH:mm:ss"
  closingTime?: string;  // "HH:mm:ss"
  pricePerHourBgn: number;
  cardPaymentEnabled: boolean;
}

export interface BookingSlot {
  id: number;
  spaceNumber: number;
  startTime: string; // ISO
  endTime: string;
  amountBgn?: number;
}

export interface LoyaltySummary {
  parkingId: number;
  parkingName: string;
  loyaltyEnabled: boolean;
  points: number;
  pointsRequired: number | null;
  rewardHours: number | null;
  pointsToNextReward: number | null;
  canUseBonus: boolean;
  visitsPerPoint?: number;
}

export interface AdminBookings{
  id: number;
  parkingName: string;
  spaceNumber: number;
  startTime: string;
  endTime: string;
  amountBgn: number | null;
  userEmail: string | null;
}


