import { Injectable, signal } from '@angular/core';

export type Idioma = 'es' | 'quc';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

  private idiomaGuardado =
    (localStorage.getItem('idioma') as Idioma) || 'es';

  idioma = signal<Idioma>(this.idiomaGuardado);

  cambiarIdioma(idioma: Idioma): void {
    this.idioma.set(idioma);
    localStorage.setItem('idioma', idioma);
  }

  esEspanol(): boolean {
    return this.idioma() === 'es';
  }
}