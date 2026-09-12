import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { RutaDenuncia } from './pages/ruta-denuncia/ruta-denuncia';
import { Prevencion } from './pages/prevencion/prevencion';
import { Asesoria } from './pages/asesoria/asesoria';
import { Instituciones } from './pages/instituciones/instituciones';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: Inicio
  },
  {
    path: 'ruta-denuncia',
    component: RutaDenuncia
  },
  {
    path: 'prevencion',
    component: Prevencion
  },
  {
    path: 'asesoria',
    component: Asesoria
  },
  {
    path: 'instituciones',
    component: Instituciones
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];