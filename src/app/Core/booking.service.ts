import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class BookingService {
  private API = 'https://reservation-production-d908.up.railway.app';

  constructor(private http: HttpClient) {}

  getAvailableSlots(from: string, to: string) {
    return this.http
      .get<string[]>(`${this.API}/appointment/available`, {
        params: { fromDate: from, daysAhead: 0 }
      })
      .pipe(
        map(slots =>
          slots.map(utc => ({
            utc,
            localDate: new Date(utc)
          }))
        )
      );
  }

  bookSession(payload: any) {
    return this.http.post(`${this.API}/appointment/book`, payload);
  }
  getBookedSessions(date: string): Observable<any[]> {
    const token = localStorage.getItem('token') || '';   // أو من auth service

    // طريقة 1: HttpHeaders (موصى بها)
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  
    // أو طريقة 2: object عادي (بس لازم تتأكد إن القيم مش undefined)
    // const headers = {
    //   Authorization: token ? `Bearer ${token}` : ''
    // };
  
    return this.http.get<any[]>(
      `${this.API}/specialist/booked/${date}`,
      { headers }
    );}
}