import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  imports: [ButtonModule, CardModule],
  template: `
    <div class="home-wrapper">
      <div class="content">

        <p class="specialist-name">Eslam Daghash</p>
        <h1 class="title">Personal Planning & Elite Coaching</h1>

        <p class="description">
          Architecting the individual wellbeing and personal & professional
          plans of celebrities, business owners, C-Suite, top 2%, outliers
          and A-Players.
        </p>

        <p class="description">
          Portraying masterpiece plans for startups and corporates moving
          from good to great through our elite coaching, corporate training,
          mentoring, and consulting services.
        </p>

        <p class="description emphasis">
          Your success partner and strategic ally.<br />
          In peace and war, my teams and I are ready.<br />
          Ready to partner. Ready to engage.
        </p>

       

      </div>
      <div class="flex algin-item-center justify-content-center">
       <button
          pButton
          label="Book Now"
          class="book-btn"
          (click)="bookNow()">
        </button></div>
    </div>
  `,
})
export class HomeComponent {
  constructor(private router: Router) {}

  bookNow() {
    this.router.navigate(['/client']);
  }
}