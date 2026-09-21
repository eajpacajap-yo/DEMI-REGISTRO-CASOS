import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioGuiaService {
  private audio: HTMLAudioElement = new Audio();
  private rutaActual: string = '';

  estaReproduciendo = signal<boolean>(false);
  moduloActivo = signal<string>('');

  constructor() {
    // Al terminar el audio por completo, resetea a cero
    this.audio.onended = () => this.detener();
    this.audio.onerror = (e) => {
      console.warn('Error en elemento Audio:', e);
      this.detener();
    };
  }

  toggleAudio(urlOArchivo: string, modulo: string): void {
    const rutaNormalizada = urlOArchivo.startsWith('/') ? urlOArchivo : `/${urlOArchivo}`;

    // CASO 1: Si es el mismo módulo y ya está reproduciendo -> PAUSAR (guarda el segundo actual)
    if (this.estaReproduciendo() && this.moduloActivo() === modulo) {
      this.audio.pause();
      this.estaReproduciendo.set(false);
      return;
    }

    // CASO 2: Si es el mismo módulo y estaba pausado -> REANUDAR (sin reiniciar el audio)
    if (!this.estaReproduciendo() && this.moduloActivo() === modulo && this.rutaActual === rutaNormalizada) {
      this.audio.play()
        .then(() => this.estaReproduciendo.set(true))
        .catch(err => console.warn('Error al reanudar:', err));
      return;
    }

    // CASO 3: Es un audio nuevo o viene de otra página -> DETENER el anterior y arrancar de cero
    this.detener();
    this.rutaActual = rutaNormalizada;
    this.moduloActivo.set(modulo);
    this.audio.src = rutaNormalizada;

    this.audio.play()
      .then(() => this.estaReproduciendo.set(true))
      .catch((err) => {
        console.warn('No se pudo reproducir la pista:', err);
        this.detener();
      });
  }

  /**
   * Detiene el audio por completo y reinicia la barra de tiempo a cero.
   */
  detener(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.estaReproduciendo.set(false);
    this.moduloActivo.set('');
    this.rutaActual = '';
  }
}