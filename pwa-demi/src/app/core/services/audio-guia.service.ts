import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioGuiaService {
  private audio = new Audio();
  estaReproduciendo = signal<boolean>(false);
  moduloActivo = signal<string>('');

  constructor() {
    this.audio.onended = () => this.limpiarEstado();
    this.audio.onerror = () => this.limpiarEstado();
  }

  toggleAudio(urlOArchivo: string, modulo: string): void {
    if (this.estaReproduciendo() && this.moduloActivo() === modulo) {
      this.detener();
      return;
    }

    this.detener();
    this.audio.src = urlOArchivo;
    this.audio.load();
    this.audio.play()
      .then(() => {
        this.estaReproduciendo.set(true);
        this.moduloActivo.set(modulo);
      })
      .catch((err) => {
        console.warn('No se pudo reproducir la pista de audio local:', err);
        this.limpiarEstado();
      });
  }

  detener(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.limpiarEstado();
  }

  private limpiarEstado(): void {
    this.estaReproduciendo.set(false);
    this.moduloActivo.set('');
  }
}