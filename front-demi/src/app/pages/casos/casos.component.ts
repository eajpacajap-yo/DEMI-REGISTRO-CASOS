import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CasoService } from '../../services/caso.service';
import { SeguimientoService } from '../../services/seguimiento.service';
import { AuthService } from '../../services/auth.service';
import { Caso } from '../../models/caso';
import { SeguimientoCaso } from '../../models/seguimiento';

@Component({
  selector: 'app-casos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './casos.component.html',
  styleUrls: ['./casos.component.css']
})
export class CasosComponent implements OnInit {

  casos: Caso[] = [];
  casosFiltrados: Caso[] = [];
  usuario: any = null;
  cargando: boolean = true;

  // Filtros de Casos
  filtroTexto: string = '';
  filtroMunicipio: string = '';

  // Modales de Casos
  mostrarModalCrear: boolean = false;
  mostrarModalEditar: boolean = false;
  mostrarModalDetalle: boolean = false;
  mostrarModalBorrar: boolean = false;

  casoSeleccionado: Caso | null = null;
  casoAEliminar: Caso | null = null;
  guardando: boolean = false;
  errorFormulario: string = '';
  mensajeExito: string = '';

  // Modales y estados de SEGUIMIENTOS (Bitácora)
  mostrarModalSeguimientos: boolean = false;
  cargandoSeguimientos: boolean = false;
  seguimientos: SeguimientoCaso[] = [];
  filtroSeguimiento: string = '';

  mostrarFormSeguimiento: boolean = false;
  editandoSeguimiento: boolean = false;
  seguimientoForm: SeguimientoCaso = {
    etapaProcesal: 'Recepción y Asesoría Legal',
    descripcionAvance: ''
  };
  seguimientoAEliminar: SeguimientoCaso | null = null;
  mostrarModalBorrarSeg: boolean = false;

  nuevoCaso: Caso = {
    codigoExpediente: '',
    municipioId: 1,
    localidad: '',
    tipoViolenciaId: 1,
    estadoId: 1
  };

  casoEdicion: Caso = {
    codigoExpediente: '',
    municipioId: 1,
    localidad: '',
    tipoViolenciaId: 1,
    estadoId: 1
  };

  municipios = [
    { id: 1, nombre: 'Totonicapán' },
    { id: 2, nombre: 'San Cristóbal Totonicapán' },
    { id: 3, nombre: 'San Francisco El Alto' },
    { id: 4, nombre: 'San Andrés Xecul' },
    { id: 5, nombre: 'Momostenango' },
    { id: 6, nombre: 'Santa María Chiquimula' },
    { id: 7, nombre: 'Santa Lucía La Reforma' },
    { id: 8, nombre: 'San Bartolo Aguas Calientes' }
  ];

  tiposViolencia = [
    { id: 1, nombre: 'Física' },
    { id: 2, nombre: 'Psicológica' },
    { id: 3, nombre: 'Económica / Patrimonial' },
    { id: 4, nombre: 'Sexual' }
  ];

  estados = [
    { id: 1, nombre: 'Registrado' },
    { id: 2, nombre: 'En Trámite Legal' },
    { id: 3, nombre: 'Medidas de Seguridad Otorgadas' },
    { id: 4, nombre: 'Finalizado' }
  ];

  etapasProcesales = [
    'Recepción y Asesoría Legal',
    'Atención y Acompañamiento Psicológico',
    'Estudio Socioeconómico / Trabajo Social',
    'Solicitud de Medidas de Seguridad',
    'Audiencia Judicial',
    'Seguimiento y Cumplimiento de Medidas',
    'Cierre / Resolución de Caso'
  ];

  constructor(
    private casoService: CasoService,
    private seguimientoService: SeguimientoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarCasos();
  }

  // --- CASOS ---
  cargarCasos(): void {
    this.cargando = true;
    this.casoService.listarCasos().subscribe({
      next: (data) => {
        this.casos = data;
        this.aplicarFiltros();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.cdr.detectChanges();
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  aplicarFiltros(): void {
    this.casosFiltrados = this.casos.filter(caso => {
      const coincideTexto = !this.filtroTexto || 
        caso.codigoExpediente.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        caso.localidad.toLowerCase().includes(this.filtroTexto.toLowerCase());

      const coincideMunicipio = !this.filtroMunicipio || 
        caso.municipio?.nombre === this.filtroMunicipio;

      return coincideTexto && coincideMunicipio;
    });
    this.cdr.detectChanges();
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroMunicipio = '';
    this.aplicarFiltros();
  }

  abrirModalCrear(): void {
    this.nuevoCaso = {
      codigoExpediente: this.generarCodigoSugerido(),
      municipioId: 1,
      localidad: '',
      tipoViolenciaId: 1,
      estadoId: 1,
      usuarioRegistroId: this.usuario?.id
    };
    this.errorFormulario = '';
    this.mensajeExito = '';
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.cdr.detectChanges();
  }

  guardarNuevoCaso(): void {
    if (!this.nuevoCaso.codigoExpediente || !this.nuevoCaso.localidad) {
      this.errorFormulario = 'Por favor complete todos los campos obligatorios.';
      return;
    }
    this.guardando = true;
    this.nuevoCaso.usuarioRegistroId = this.usuario?.id;

    this.casoService.crearCaso(this.nuevoCaso).subscribe({
      next: () => {
        this.guardando = false;
        this.mensajeExito = '¡Expediente registrado!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cerrarModalCrear();
          this.mensajeExito = '';
          this.cargarCasos();
        }, 1500);
      },
      error: (err) => {
        this.guardando = false;
        this.errorFormulario = err.error?.message || 'Error al registrar.';
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalEditar(caso: Caso): void {
    this.errorFormulario = '';
    this.mensajeExito = '';
    this.casoEdicion = {
      id: caso.id,
      codigoExpediente: caso.codigoExpediente,
      municipioId: caso.municipio?.id || 1,
      localidad: caso.localidad,
      tipoViolenciaId: caso.tipoViolencia?.id || 1,
      estadoId: caso.estado?.id || 1
    };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.mensajeExito = '';
    this.errorFormulario = '';
    this.cdr.detectChanges();
  }

  guardarEdicionCaso(): void {
    if (!this.casoEdicion.id || !this.casoEdicion.localidad) {
      this.errorFormulario = 'Por favor complete todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.errorFormulario = '';
    this.mensajeExito = '';

    this.casoService.actualizarCaso(this.casoEdicion.id, this.casoEdicion).subscribe({
      next: () => {
        this.guardando = false;
        this.mensajeExito = '¡Expediente actualizado correctamente!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cerrarModalEditar();
          this.mensajeExito = '';
          this.cargarCasos();
        }, 1000);
      },
      error: (err) => {
        this.guardando = false;
        this.errorFormulario = err.error || 'Error al actualizar el expediente.';
        this.cdr.detectChanges();
      }
    });
  }

  verDetalle(caso: Caso): void {
    this.casoSeleccionado = caso;
    this.mostrarModalDetalle = true;
    this.cdr.detectChanges();
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.casoSeleccionado = null;
    this.cdr.detectChanges();
  }

  confirmarBorrar(caso: Caso): void {
    this.casoAEliminar = caso;
    this.mostrarModalBorrar = true;
    this.cdr.detectChanges();
  }

  cerrarModalBorrar(): void {
    this.mostrarModalBorrar = false;
    this.casoAEliminar = null;
    this.cdr.detectChanges();
  }

  ejecutarBorrado(): void {
    if (!this.casoAEliminar?.id) return;
    this.guardando = true;

    this.casoService.eliminarCaso(this.casoAEliminar.id).subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModalBorrar();
        this.cargarCasos();
      },
      error: () => {
        this.guardando = false;
        alert('No se pudo eliminar el expediente (puede tener seguimientos asociados).');
        this.cerrarModalBorrar();
      }
    });
  }

  // --- SEGUIMIENTOS (BITÁCORA) ---
  abrirSeguimientos(caso: Caso): void {
    this.casoSeleccionado = caso;
    this.mostrarModalSeguimientos = true;
    this.mostrarFormSeguimiento = false;
    this.filtroSeguimiento = '';
    this.cargarHistorialSeguimientos(caso.id!);
  }

  cerrarSeguimientos(): void {
    this.mostrarModalSeguimientos = false;
    this.casoSeleccionado = null;
    this.seguimientos = [];
    this.cdr.detectChanges();
  }

  cargarHistorialSeguimientos(casoId: number): void {
    this.cargandoSeguimientos = true;
    this.seguimientoService.listarPorCaso(casoId).subscribe({
      next: (data) => {
        this.seguimientos = data;
        this.cargandoSeguimientos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar seguimientos', err);
        this.cargandoSeguimientos = false;
        this.cdr.detectChanges();
      }
    });
  }

  get seguimientosFiltrados(): SeguimientoCaso[] {
    if (!this.filtroSeguimiento) return this.seguimientos;
    const txt = this.filtroSeguimiento.toLowerCase();
    return this.seguimientos.filter(s => 
      s.etapaProcesal.toLowerCase().includes(txt) ||
      s.descripcionAvance.toLowerCase().includes(txt) ||
      (s.usuario?.primerNombre && s.usuario.primerNombre.toLowerCase().includes(txt))
    );
  }

  iniciarNuevoSeguimiento(): void {
    this.editandoSeguimiento = false;
    this.seguimientoForm = {
      casoId: this.casoSeleccionado?.id,
      usuarioId: this.usuario?.id,
      etapaProcesal: this.etapasProcesales[0],
      descripcionAvance: ''
    };
    this.mostrarFormSeguimiento = true;
    this.cdr.detectChanges();
  }

  iniciarEdicionSeguimiento(seg: SeguimientoCaso): void {
    this.editandoSeguimiento = true;
    this.seguimientoForm = {
      id: seg.id,
      casoId: this.casoSeleccionado?.id,
      usuarioId: this.usuario?.id,
      etapaProcesal: seg.etapaProcesal,
      descripcionAvance: seg.descripcionAvance
    };
    this.mostrarFormSeguimiento = true;
    this.cdr.detectChanges();
  }

  cancelarFormSeguimiento(): void {
    this.mostrarFormSeguimiento = false;
    this.cdr.detectChanges();
  }

  guardarSeguimiento(): void {
    if (!this.seguimientoForm.descripcionAvance.trim()) return;

    this.guardando = true;
    if (this.editandoSeguimiento && this.seguimientoForm.id) {
      this.seguimientoService.actualizarSeguimiento(this.seguimientoForm.id, this.seguimientoForm).subscribe({
        next: () => {
          this.guardando = false;
          this.mostrarFormSeguimiento = false;
          this.cargarHistorialSeguimientos(this.casoSeleccionado!.id!);
        },
        error: () => {
          this.guardando = false;
          alert('Error al actualizar el avance.');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.seguimientoForm.casoId = this.casoSeleccionado!.id;
      this.seguimientoForm.usuarioId = this.usuario?.id;
      this.seguimientoService.crearSeguimiento(this.seguimientoForm).subscribe({
        next: () => {
          this.guardando = false;
          this.mostrarFormSeguimiento = false;
          this.cargarHistorialSeguimientos(this.casoSeleccionado!.id!);
        },
        error: () => {
          this.guardando = false;
          alert('Error al registrar el avance.');
          this.cdr.detectChanges();
        }
      });
    }
  }

  confirmarBorrarSeguimiento(seg: SeguimientoCaso): void {
    this.seguimientoAEliminar = seg;
    this.mostrarModalBorrarSeg = true;
    this.cdr.detectChanges();
  }

  cerrarModalBorrarSeg(): void {
    this.mostrarModalBorrarSeg = false;
    this.seguimientoAEliminar = null;
    this.cdr.detectChanges();
  }

  ejecutarBorradoSeguimiento(): void {
    if (!this.seguimientoAEliminar?.id) return;
    this.guardando = true;
    this.seguimientoService.eliminarSeguimiento(this.seguimientoAEliminar.id).subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModalBorrarSeg();
        this.cargarHistorialSeguimientos(this.casoSeleccionado!.id!);
      },
      error: () => {
        this.guardando = false;
        alert('Error al eliminar la anotación.');
        this.cerrarModalBorrarSeg();
      }
    });
  }

  generarCodigoSugerido(): string {
    const anio = new Date().getFullYear();
    const corr = (this.casos.length + 1).toString().padStart(4, '0');
    return `TOT-${anio}-${corr}`;
  }
}