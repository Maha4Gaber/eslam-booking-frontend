import { Component } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../Core/booking.service';
@Component({
  standalone: true,
  imports: [
    CalendarModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './client-calendar.component.html',
  styleUrls: ['./client-calendar.component.scss']
})
export class ClientCalendarComponent {

  // ===== Calendar =====
  today: Date = new Date();
  selectedDate!: Date;

  disabledDates: Date[] = [];
  disabledWeekDays: number[] = [5, 6]; // Friday & Saturday
  availableDates: string[] = []; // yyyy-m-d

  // ===== Slots =====
  allSlots: any[] = [];
  availableTimes: string[] = [];

  // ===== Booking Dialog =====
  showDialog = false;
  selectedTime = '';

  name = '';
  type: any;

  sessionTypes = [
    { label: 'Positive Psychology Coaching', value: 'Positive Psychology Coaching' },
    { label: 'Bond & Bliss', value: 'Bond & Bliss' },
    { label: 'Relationship Coaching', value: 'Relationship Coaching' },
    { label: 'Personal Planning Journey', value: 'Personal Planning Journey' },
    { label: 'Professional Coaching', value: 'Professional Coaching' }
  ];

  constructor(private bookingService: BookingService) {}

  // =========================
  // Calendar Events
  // =========================

  onDateSelect() {
    if (!this.selectedDate) return;

    const from = this.startOfMonth(this.selectedDate);
    const to = this.endOfMonth(this.selectedDate);

    this.bookingService.getAvailableSlots(from, to).subscribe(slots => {
      this.allSlots = slots;

      this.extractAvailableDates();
      this.buildDisabledDates();
      this.filterSlotsForSelectedDate();
    });
  }

  // =========================
  // Slots Handling
  // =========================

  filterSlotsForSelectedDate() {
    const selectedKey = this.dateKey(this.selectedDate);

    this.availableTimes = this.allSlots
      .filter(slot =>
        this.dateKey(slot.localDate) === selectedKey &&
        slot.localDate > new Date()
      )
      .map(slot =>
        slot.localDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      );
  }

  openBooking(time: string) {
    this.selectedTime = time;
    this.showDialog = true;
  }

  confirmBooking() {
    if (!this.name || !this.type) return;

    const payload = {
      clientName: this.name,
      serviceType: this.type,
      dateTime: this.buildUtcDate()
    };

    this.bookingService.bookSession(payload).subscribe(() => {
      this.showDialog = false;

      // 🔁 Refresh availability after booking
      this.onDateSelect();
    });
  }

  // =========================
  // Disable Days Logic
  // =========================

  extractAvailableDates() {
    this.availableDates = [];

    this.allSlots.forEach(slot => {
      const key = this.dateKey(slot.localDate);
      if (!this.availableDates.includes(key)) {
        this.availableDates.push(key);
      }
    });
  }

  buildDisabledDates() {
    this.disabledDates = [];

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);

      // ❌ Disable previous days
      if (this.isPastDay(d)) {
        this.disabledDates.push(d);
        continue;
      }

      // ❌ Disable Friday & Saturday
      if (this.isWeekend(d)) {
        this.disabledDates.push(d);
        continue;
      }

      // ❌ Disable days without slots
      const key = this.dateKey(d);
      if (!this.availableDates.includes(key)) {
        this.disabledDates.push(d);
      }
    }
  }

  // =========================
  // Helpers
  // =========================

  isWeekend(d: Date): boolean {
    const day = d.getDay();
    // Friday = 5 , Saturday = 6
    return day === 5 || day === 6;
  }

  isPastDay(d: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const check = new Date(d);
    check.setHours(0, 0, 0, 0);

    return check < today;
  }

  buildUtcDate(): string {
    const [hour, minute] = this.selectedTime.split(':');
    const d = new Date(this.selectedDate);
    d.setHours(+hour, +minute, 0, 0);
    return d.toISOString();
  }

  startOfMonth(d: Date): string {
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
  }

  endOfMonth(d: Date): string {
    return new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      0,
      23,
      59,
      59
    ).toISOString();
  }

  dateKey(d: Date): string {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }
}