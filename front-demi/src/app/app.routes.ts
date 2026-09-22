import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CasosComponent } from './pages/casos/casos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'casos', component: CasosComponent },
  { path: 'multimedia', loadComponent: () => import('./pages/multimedia/multimedia').then(m => m.MultimediaComponent)},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'reportes',loadComponent: () => import('./pages/reportes/reportes').then(m => m.ReportesComponent)}
];