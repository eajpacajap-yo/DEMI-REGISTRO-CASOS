import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CasosComponent } from './pages/casos/casos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'casos', component: CasosComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];