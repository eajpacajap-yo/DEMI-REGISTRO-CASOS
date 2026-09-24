import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaDenunciaData, PasoRuta, InstitucionRuta } from '../../core/models/ruta-denuncia.model';
import { RutaDenunciaService } from '../../core/services/ruta-denuncia';
import { IdiomaService } from '../../core/services/idioma';
import { AudioGuiaService } from '../../core/services/audio-guia.service';
@Component({
  selector: 'app-ruta-denuncia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ruta-denuncia.html',
  styleUrl: './ruta-denuncia.css'
})
export class RutaDenuncia implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  
  audioService = inject(AudioGuiaService);
  private rutaService = inject(RutaDenunciaService);
  idiomaService = inject(IdiomaService);

  datos?: RutaDenunciaData;
  cargando = true;
  error = false;
  pasoSeleccionado?: PasoRuta;

  ngOnInit(): void {
    this.rutaService.obtenerRuta().subscribe({
      next: (datos) => {
        this.datos = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando la ruta de denuncia:', err);
        this.error = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  texto(t?: { es: string; quc: string }): string {
    if (!t) return '';
    return this.idiomaService.idioma() === 'quc' ? t.quc : t.es;
  }

  seleccionarPaso(paso: PasoRuta): void {
    if (this.pasoSeleccionado?.id === paso.id) {
      this.pasoSeleccionado = undefined;
      return;
    }
    this.pasoSeleccionado = paso;
  }

  obtenerInstitucion(codigo: string): InstitucionRuta | undefined {
    return this.datos?.instituciones.find((inst) => inst.codigo === codigo);
  }
    
  reproducirGuiaAudio(): void {
    const rutaAudio = 'assets/audio/ruta.mp3';
    this.audioService.toggleAudio(rutaAudio, 'ruta-denuncia');
  }

  obtenerTelefonos(telefono?: string | string[]): string[] {
  if (!telefono) return [];
  return Array.isArray(telefono) ? telefono : [telefono];
}
obtenerHorariosLista(horario?: { es: string | string[]; quc: string | string[] }): string[] {
  if (!horario) return [];
  const val = this.idiomaService.idioma() === 'quc' ? horario.quc : horario.es;
  return Array.isArray(val) ? val : [val];
}
}