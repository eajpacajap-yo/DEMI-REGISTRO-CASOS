import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrevencionData, TipoViolencia } from '../../core/models/prevencion.model';
import { PrevencionService } from '../../core/services/prevencion';
import { IdiomaService } from '../../core/services/idioma';
import { AudioGuiaService } from '../../core/services/audio-guia.service';
@Component({
  selector: 'app-prevencion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prevencion.html',
  styleUrl: './prevencion.css'
})
export class Prevencion implements OnInit {
  audioService = inject(AudioGuiaService);
  private prevencionService = inject(PrevencionService);
  idiomaService = inject(IdiomaService);

  datos?: PrevencionData;
  cargando = true;
  error = false;
  tipoSeleccionado?: string;

  ngOnInit(): void {
    this.prevencionService.obtenerPrevencion().subscribe({
      next: (datos) => {
        this.datos = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar contenido preventivo:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  texto(t?: { es: string; quc: string }): string {
    if (!t) return '';
    return this.idiomaService.idioma() === 'quc' ? t.quc : t.es;
  }

  toggleTipo(id: string): void {
    this.tipoSeleccionado = this.tipoSeleccionado === id ? undefined : id;
  }

  reproducirGuiaAudio(): void {
    const rutaAudio = 'assets/audio/guia-prevencion-quc.mp3'; 
    this.audioService.toggleAudio(rutaAudio, 'ruta-denuncia');
  }
}
