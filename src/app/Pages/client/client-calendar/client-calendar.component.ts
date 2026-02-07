import { Component } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../Core/booking.service';

interface Slot {
  utc: string;
  localDate: Date;
}

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
  styleUrls: ['./client-calendar.component.css']
})
export class ClientCalendarComponent {

  // ===== Calendar =====
  today: Date = new Date();
  selectedDate!: Date;

  disabledWeekDays: number[] = [5, 6]; // Friday & Saturday

  // ===== Slots =====
  allSlots: Slot[] = [];
  availableTimes: string[] = [];

  // ===== Booking Dialog =====
  showDialog = false;
  selectedTime = '';

  name = '';
  email = '';
  phone = '';
  type = '';

  sessionTypes = [
    { label: 'Planning', value: 'PLANNING' },
    { label: 'Life Coaching', value: 'LIFE_COACHING' },
    { label: 'One To One Session', value: 'ONE_TO_ONE_SESSION' },
    { label: 'Relationship Coaching', value: 'RELATIONSHIP_COACHING' },
  ];

  constructor(private bookingService: BookingService) {}

  // =========================
  // Calendar Events
  // =========================

  onDateSelect() {
    if (!this.selectedDate) return;

    const from = this.formatDate(this.selectedDate);

    this.bookingService.getAvailableSlots(from, '').subscribe(slots => {
      this.allSlots = slots;
      this.filterSlotsForSelectedDate();
    });
  }

  // =========================
  // Slots Handling
  // =========================

  filterSlotsForSelectedDate() {
    if (!this.selectedDate) {
      this.availableTimes = [];
      return;
    }

    const selectedKey = this.dateKey(this.selectedDate);
    const now = new Date();

    this.availableTimes = this.allSlots
      .filter(slot =>
        this.dateKey(slot.localDate) === selectedKey &&
        slot.localDate > now
      )
      .map(slot =>
        slot.localDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      );
  }

  openBooking(time: string) {
    this.selectedTime = time;
    this.showDialog = true;
  }

  confirmBooking() {
    if (!this.name || !this.type || !this.selectedTime) return;

    const payload = {
      clientName: this.name,
      serviceType: this.type,
      email:this.email,
      phone:this.phone,
      dateTime: this.buildUtcDate()
    };

    this.bookingService.bookSession(payload).subscribe(() => {
      this.showDialog = false;
      this.name = '';
      this.email = '';
      this.phone = '';
      this.type = '';
      this.selectedTime = '';

      this.onDateSelect();
    });
  }

  // =========================
  // Helpers
  // =========================

  buildUtcDate(): string {
    const [hour, minute] = this.selectedTime.split(':');
    const d = new Date(this.selectedDate);
    d.setHours(+hour, +minute, 0, 0);
    return d.toISOString();
  }

  formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  dateKey(d: Date): string {
    return this.formatDate(d);
  }
}