import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IdiomaService } from '../../core/services/idioma';
import { AudioGuiaService } from '../../core/services/audio-guia.service';
import { RecursoGaleriaVisual } from '../../core/models/recurso-multimedia.model';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css'
})
export class Galeria implements OnInit {
  private http = inject(HttpClient);
  idiomaService = inject(IdiomaService);
  audioService = inject(AudioGuiaService);

  galeria: RecursoGaleriaVisual[] = [];
  elementoSeleccionado?: RecursoGaleriaVisual;
  cargando = true;

  ngOnInit(): void {
    this.http.get<{ elementos: RecursoGaleriaVisual[] }>('assets/data/galeria.json').subscribe({
      next: (data) => {
        this.galeria = data.elementos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando catálogo de galería:', err);
        this.cargando = false;
      }
    });
  }

  texto(t?: { es: string; quc: string }): string {
    if (!t) return '';
    return this.idiomaService.idioma() === 'quc' ? t.quc : t.es;
  }

  reproducirGuiaGaleria(): void {
    this.audioService.toggleAudio('assets/audio/guia-galeria-quc.mp3', 'galeria');
  }

  ampliarImagen(item: RecursoGaleriaVisual): void {
    this.elementoSeleccionado = item;
  }

  cerrarModal(): void {
    this.elementoSeleccionado = undefined;
  }
}