import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CasosComponent } from './pages/casos/casos.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminLayoutComponent, // Este componente será la "carcasa" fija
    children: [
      { path: 'casos', component: CasosComponent },
      { path: 'multimedia', loadComponent: () => import('./pages/multimedia/multimedia').then(m => m.MultimediaComponent) },
      { path: 'reportes', loadComponent: () => import('./pages/reportes/reportes').then(m => m.ReportesComponent) },
      { path: 'usuarias', loadComponent: () => import('./pages/usuarias/usuarias.component').then(m => m.UsuariosComponent) },
      { path: '', redirectTo: 'casos', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];