import { Injectable, signal, computed } from '@angular/core';
import { TRADUCCIONES } from '../constants/traducciones';

export type Idioma = 'es' | 'quc';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

  private idiomaGuardado =
    (localStorage.getItem('idioma') as Idioma) || 'es';

  idioma = signal<Idioma>(this.idiomaGuardado);

  t = computed(() => TRADUCCIONES[this.idioma()]);
  cambiarIdioma(idioma: Idioma): void {
    this.idioma.set(idioma);
    localStorage.setItem('idioma', idioma);
  }

  esEspanol(): boolean {
    return this.idioma() === 'es';
  }
}