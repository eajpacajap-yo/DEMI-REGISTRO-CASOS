import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  online = signal<boolean>(false);

  constructor() {

    // Comprobación real al iniciar
    this.verificarConexion();

    // Cuando el navegador informa que perdió conexión
    window.addEventListener('offline', () => {
      this.online.set(false);
    });

    // Cuando informa que recuperó conexión
    window.addEventListener('online', () => {
      this.verificarConexion();
    });

    // Al volver a la aplicación
    window.addEventListener('focus', () => {
      this.verificarConexion();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.verificarConexion();
      }
    });
  }


  async verificarConexion(): Promise<void> {

    // Empezamos suponiendo que no existe conexión.
    // Solo cambiaremos a true si el servidor realmente responde.
    this.online.set(false);

    const controlador = new AbortController();

    const timeout = window.setTimeout(() => {
      controlador.abort();
    }, 3000);

    try {

      const respuesta = await fetch(
        `${window.location.origin}/favicon.ico?ngsw-bypass=true&t=${Date.now()}`,
        {
          method: 'GET',

          headers: {
            'ngsw-bypass': 'true'
          },

          cache: 'no-store',

          signal: controlador.signal
        }
      );

      if (respuesta.ok) {
        this.online.set(true);
      }

    } catch {

      this.online.set(false);

    } finally {

      clearTimeout(timeout);

    }
  }
}