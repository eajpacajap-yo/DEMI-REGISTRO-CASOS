import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MultimediaAdminService, RecursoAdmin } from '../../services/multimedia-admin.service';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './multimedia.html',
  styleUrl: './multimedia.css'
})
export class MultimediaComponent implements OnInit {
  @ViewChild('inputArchivo') inputArchivoRef!: ElementRef<HTMLInputElement>;
  private mediaService = inject(MultimediaAdminService);
  private cdr = inject(ChangeDetectorRef);

  // Lista de recursos
  recursos: RecursoAdmin[] = [];
  cargandoLista = false;

  // Formulario de creación
  titulo = '';
  modulo = 'galeria';
  idiomaId = 1;
  descripcionEs = '';
  descripcionQuc = '';
  archivoSeleccionado: File | null = null;
  vistaPreviaUrl: string | null = null;

  // Estado y edición
  cargando = false;
  mensajeExito = '';
  mensajeError = '';
  recursoEnEdicion: RecursoAdmin | null = null;

  ngOnInit(): void {
    this.cargarListado();
  }

  cargarListado(): void {
    this.cargandoLista = true;
    this.mediaService.obtenerTodos().subscribe({
      next: (data) => {
        this.recursos = data;
        this.cargandoLista = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error obteniendo listado multimedia:', err);
        this.cargandoLista = false;
        this.cdr.detectChanges();
      }
    });
  }

  alSeleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];
      if (!archivo.type.startsWith('image/')) {
        this.mensajeError = 'Por favor selecciona un formato de imagen válido (.png, .jpg, .webp).';
        input.value = '';
        this.cdr.detectChanges();
        return;
      }
      this.archivoSeleccionado = archivo;
      this.mensajeError = '';

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
      this.mensajeError = 'Debe ingresar un título y adjuntar un archivo de imagen.';
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
        this.mensajeExito = '¡Recurso publicado exitosamente!';
        this.limpiarFormulario();
        this.cargarListado();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.status === 403 
          ? 'No cuenta con permisos de Administradora.' 
          : 'Error al subir la imagen al servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  iniciarEdicion(item: RecursoAdmin): void {
    this.recursoEnEdicion = { ...item };
  }

  cancelarEdicion(): void {
    this.recursoEnEdicion = null;
  }

  guardarEdicion(): void {
    if (!this.recursoEnEdicion) return;

    this.mediaService.actualizarRecurso(this.recursoEnEdicion.id, this.recursoEnEdicion).subscribe({
      next: () => {
        this.mensajeExito = 'Recurso actualizado con éxito.';
        this.recursoEnEdicion = null;
        this.cargarListado();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.mensajeError = 'Error al actualizar el recurso.';
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(item: RecursoAdmin): void {
    const confirmar = confirm(`¿Está segura de eliminar permanentemente "${item.titulo}"? Esta acción lo removerá de la PWA.`);
    if (!confirmar) return;

    this.mediaService.eliminarRecurso(item.id).subscribe({
      next: () => {
        this.mensajeExito = 'Recurso eliminado correctamente.';
        this.cargarListado();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.mensajeError = 'No fue posible eliminar el archivo.';
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.titulo = '';
    this.descripcionEs = '';
    this.descripcionQuc = '';
    this.archivoSeleccionado = null;
    this.vistaPreviaUrl = null;
       if (this.inputArchivoRef && this.inputArchivoRef.nativeElement) {
      this.inputArchivoRef.nativeElement.value = '';
      }

    this.cdr.detectChanges();
  }
}