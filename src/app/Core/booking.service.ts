import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class BookingService {
  private API = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAvailableSlots(from: string, to: string) {
    return this.http.get<any[]>(`${this.API}/appointment/available`, {
      params: { fromDate:from, daysAhead:1 }
    }).pipe(
      map(slots =>
        slots.map(s => ({
          ...s,
          localDate: new Date(s.utc) // UTC ➜ local
        }))
      )
    );
  }

  bookSession(payload: any) {
    return this.http.post(`${this.API}/appointment/book`, payload);
  }
  getBookedSessions(date: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API}/specialist/booked/${date}`
    );
  }
}