import { Component } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { BookingService } from '../Core/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule,
    CommonModule
  ],
  template: `
    <div class="calendar-page mt-5 p-5">
      
      <!-- LEFT : CALENDAR -->
      <div class="calendar-panel">
        <p-calendar
          inline
          [(ngModel)]="date"
          [minDate]="minDate"
          [disabledDays]="[5,6]"
          (onSelect)="loadBookedSlots()">
        </p-calendar>
      </div>

      <!-- RIGHT : BOOKED SLOTS -->
      <div class="slots-panel">
        <h3 class="mb-3">
          Booked Sessions
          <span *ngIf="date" class="date-label">
            {{ date | date:'fullDate' }}
          </span>
        </h3>

        <ng-container *ngIf="loading">
          <p>Loading...</p>
        </ng-container>

        <ng-container *ngIf="!loading && sessions.length === 0">
          <p class="empty">No booked sessions for this day</p>
        </ng-container>

        <div *ngFor="let s of sessions" class="slot-card">
          <div class="time">{{ s.time }}</div>
          <div class="info">
            <div class="name">{{ s.clientName }}</div>
            <div class="type">{{ s.type }}</div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .calendar-page {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;
      align-items: start;
    }

    .calendar-panel {
      position: sticky;
      top: 20px;
    }

    .slots-panel {
      background: #111;
      border-radius: 12px;
      padding: 1.5rem;
      min-height: 300px;
    }

    .date-label {
      font-size: 0.9rem;
      opacity: 0.7;
      margin-left: 10px;
    }

    .slot-card {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 10px;
      background: #1e1e1e;
      margin-bottom: 1rem;
    }

    .time {
      font-weight: bold;
      color: #f3c77a;
      width: 70px;
    }

    .name {
      font-weight: 600;
    }

    .type {
      font-size: 0.85rem;
      opacity: 0.8;
    }

    .empty {
      opacity: 0.6;
      text-align: center;
      margin-top: 2rem;
    }
  `]
})
export class SpecialistCalendarComponent {

  date!: Date;
  sessions: any[] = [];
  loading = false;
  minDate = new Date(); // disable previous days

  constructor(private booking: BookingService) {}

  loadBookedSlots() {
    if (!this.date) return;

    const isoDate = this.toISODate(this.date);
    this.loading = true;
    this.sessions = [];

    this.booking.getBookedSessions(isoDate)
      .subscribe({
        next: (res:any) => {
          this.sessions = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  private toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}