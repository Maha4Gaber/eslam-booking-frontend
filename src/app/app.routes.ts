import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home.component';
import { ClientCalendarComponent } from './Pages/client/client-calendar/client-calendar.component';
import { SpecialistLoginComponent } from './Pages/specialist-login.component';
import { SpecialistCalendarComponent } from './Pages/specialist-calendar.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'client', component: ClientCalendarComponent },
  { path: 'specialist/login', component: SpecialistLoginComponent },
  { path: 'specialist/calendar', component: SpecialistCalendarComponent }
];