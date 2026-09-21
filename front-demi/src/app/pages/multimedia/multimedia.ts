import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MultimediaAdminService } from '../../services/multimedia-admin.service';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './multimedia.html',
  styleUrl: './multimedia.css'
})
export class MultimediaComponent {
  private mediaService = inject(MultimediaAdminService);
  private cdr = inject(ChangeDetectorRef); // <-- Inyección obligatoria

  titulo = '';
  modulo = 'galeria';
  idiomaId = 1; // 1: Español, 2: K'iche'
  descripcionEs = '';
  descripcionQuc = '';
  archivoSeleccionado: File | null = null;
  vistaPreviaUrl: string | null = null;

  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  alSeleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];

      // Validar formato de imagen
      if (!archivo.type.startsWith('image/')) {
        this.mensajeError = 'Por favor selecciona un archivo de imagen válido (.png, .jpg, .webp).';
        this.cdr.detectChanges();
        return;
      }

      this.archivoSeleccionado = archivo;
      this.mensajeError = '';

      // Crear vista previa local
      const reader = new FileReader();
      reader.onload = () => {
        this.vistaPreviaUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(archivo);
    }
  }

  guardarRecurso(): void {
    if (!this.archivoSeleccionado || !this.titulo.trim()) {
      this.mensajeError = 'Debe ingresar un título y adjuntar una imagen obligatoriamente.';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cdr.detectChanges();

    const formData = new FormData();
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('titulo', this.titulo);
    formData.append('modulo', this.modulo);
    formData.append('idiomaId', this.idiomaId.toString());
    formData.append('descripcionEs', this.descripcionEs);
    formData.append('descripcionQuc', this.descripcionQuc);

    this.mediaService.subirRecurso(formData).subscribe({
      next: () => {
        this.cargando = false;
        this.mensajeExito = '¡Recurso visual publicado exitosamente para la PWA!';
        this.limpiarFormulario();
        this.cdr.detectChanges(); // Desbloquea el botón y muestra el mensaje verde
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error en subida:', err);
        this.mensajeError = err.status === 403 
          ? 'Acceso denegado: Se requieren permisos de Administradora.' 
          : 'Error al comunicarse con el servidor al subir la imagen.';
        this.cdr.detectChanges(); // Desbloquea el botón y muestra el error
      }
    });
  }

  limpiarFormulario(): void {
    this.titulo = '';
    this.descripcionEs = '';
    this.descripcionQuc = '';
    this.archivoSeleccionado = null;
    this.vistaPreviaUrl = null;
  }
}