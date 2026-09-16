import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive, } from '@angular/router';
import { IdiomaService, Idioma } from './core/services/idioma';
import { ConexionService } from './core/services/conexion';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  idiomaService = inject(IdiomaService);
  conexionService = inject(ConexionService);
  router = inject(Router);

  cambiarIdioma(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.idiomaService.cambiarIdioma(select.value as 'es' | 'quc');
  }

  salidaRapida(): void {

    // Borra únicamente información temporal de la PWA.
    sessionStorage.clear();

    // Redirección a una página neutral.
    window.location.href = 'https://www.google.com/';
  }
}
