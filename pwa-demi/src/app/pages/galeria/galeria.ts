import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  idiomaService = inject(IdiomaService);
  audioService = inject(AudioGuiaService);

  galeria: RecursoGaleriaVisual[] = [];
  elementoSeleccionado?: RecursoGaleriaVisual;
  cargando = true;

  ngOnInit(): void {
    this.cargarGaleria();
  }

  cargarGaleria(): void {
    const urlApiPublica = 'http://localhost:8080/api/recursos/publicos/galeria';

    // 1. Si el dispositivo tiene red, consulta las imágenes publicadas por administración
    if (navigator.onLine) {
      this.http.get<any[]>(urlApiPublica).subscribe({
        next: (remotos) => {
          if (remotos && remotos.length > 0) {
            // Mapea las entidades que vienen desde Spring Boot / PostgreSQL
            this.galeria = remotos.map((r) => ({
              id: r.id,
              titulo: { es: r.titulo, quc: r.titulo },
              descripcion: { es: r.descripcionEs || '', quc: r.descripcionQuc || '' },
              imagen_url: `http://localhost:8080${r.rutaAlmacenamiento}`,
              categoria: r.moduloPwa
            }));
          } else {
            this.cargarRespaldoLocal();
          }
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.warn('Backend inalcanzable, cargando recursos locales:', err);
          this.cargarRespaldoLocal();
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // 2. Si está offline, carga el respaldo local empaquetado
      this.cargarRespaldoLocal();
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  cargarRespaldoLocal(): void {
    this.http.get<{ elementos: RecursoGaleriaVisual[] }>('assets/data/galeria.json').subscribe({
      next: (data) => {
        this.galeria = data.elementos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando catálogo local de galería:', err);
      }
    });
  }

  texto(t?: { es: string; quc: string }): string {
    if (!t) return '';
    return this.idiomaService.idioma() === 'quc' ? t.quc : t.es;
  }

  reproducirGuiaGaleria(): void {
    this.audioService.toggleAudio('assets/audio/galeria.mp3', 'galeria');
  }

  ampliarImagen(item: RecursoGaleriaVisual): void {
    this.elementoSeleccionado = item;
  }

  cerrarModal(): void {
    this.elementoSeleccionado = undefined;
  }
}