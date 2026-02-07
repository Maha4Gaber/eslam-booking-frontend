import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../Core/auth.service';

@Component({
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="flex justify-content-center align-items-center h-screen">
      <div class="card p-5 w-30rem">
        <h2 class="text-center mb-4">Portal Login</h2>

        <input
          pInputText
          placeholder="Email"
          class="w-full mb-3"
          [(ngModel)]="user"
          type="email"
          />

        <input
          pInputText
          placeholder="Password"
          type="password"
          class="w-full mb-4"
          [(ngModel)]="pass" />

        <button
          pButton
          label="Login"
          class="w-full"
          [loading]="loading"
          (click)="login()">
        </button>
      </div>
    </div>
  `
})
export class SpecialistLoginComponent {
  user = '';
  pass = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login() {
    if (!this.user || !this.pass) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing data',
        detail: 'Username and password are required'
      });
      return;
    }

    this.loading = true;

    this.authService
      .specialistLogin({
        email: this.user,
        password: this.pass
      })
      .subscribe({
        next: (res) => {
          this.loading = false;

          // save token
          localStorage.setItem('token', res.accessToken);

          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: `Welcome ${res.name}`
          });

          setTimeout(() => {
            this.router.navigate(['/specialist/calendar']);
          }, 1000);
        },
        error: () => {
          this.loading = false;
           

          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid username or password'
          });
        }
      });
  }
}