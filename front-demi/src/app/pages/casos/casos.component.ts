import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CasoService } from '../../services/caso.service';
import { SeguimientoService } from '../../services/seguimiento.service';
import { AuthService } from '../../services/auth.service';
import { Caso } from '../../models/caso';
import { SeguimientoCaso } from '../../models/seguimiento';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, UsuarioRegistro } from '../../models/usuario';


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

  // Variables para cambio de contraseña
mostrarModalPassword: boolean = false;
guardandoPassword: boolean = false;
errorPassword: string = '';
mensajeExitoPassword: string = '';

passwordForm = {
  passwordActual: '',
  nuevoPassword: '',
  confirmarPassword: ''
};

abrirModalPassword(): void {
  this.passwordForm = {
    passwordActual: '',
    nuevoPassword: '',
    confirmarPassword: ''
  };
  this.errorPassword = '';
  this.mensajeExitoPassword = '';
  this.mostrarModalPassword = true;
  this.cdr.detectChanges();
}

cerrarModalPassword(): void {
  this.mostrarModalPassword = false;
  this.errorPassword = '';
  this.mensajeExitoPassword = '';
  this.cdr.detectChanges();
}

  
  // Gestion de usuarias
  mostrarModalGestionUsuarios: boolean = false;
  mostrarFormUsuario: boolean = false;
  editandoUsuario: boolean = false;
  cargandoUsuarios: boolean = false;
  listaUsuarios: Usuario[] = [];
  filtroUsuario: string = '';

  usuarioForm: UsuarioRegistro = {
    primerNombre: '',
    segundoNombre: '',
    tercerNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    password: '',
    rolId: 2,
    activo: true
  };
  errorUsuario: string = '';
  mensajeExitoUsuario: string = '';
  usuarioAEliminar: Usuario | null = null;
  mostrarModalBorrarUsu: boolean = false;

  rolesDisponibles = [
    { id: 1, nombre: 'Administradora (ROLE_ADMIN)' },
    { id: 2, nombre: 'Profesional de Atención (ROLE_PROFESIONAL)' }
  ];
  // Formulario nuevo caso
  nuevoCaso: Caso = {
    codigoExpediente: '',
    municipioId: 1,
    localidad: '',
    tipoViolenciaId: 1,
    estadoId: 1
  };

  // Formulario edición caso
  casoEdicion: Caso = {
    codigoExpediente: '',
    municipioId: 1,
    localidad: '',
    tipoViolenciaId: 1,
    estadoId: 1
  };

  // Catálogos
  municipios = [
    { id: 1, nombre: 'Totonicapán' },
    { id: 2, nombre: 'San Cristóbal Totonicapán' },
    { id: 3, nombre: 'San Francisco El Alto' },
    { id: 4, nombre: 'San Andrés Xecul' },
    { id: 5, nombre: 'Momostenango' },
    { id: 6, nombre: 'Santa María Chiquimula' },
    { id: 7, nombre: 'Santa Lucía La Reforma' },
    { id: 8, nombre: 'San Bartolo Aguas Calientes ' }
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

mostrarModalUsuario: boolean = false;
guardandoUsuario: boolean = false;


nuevoUsuario: UsuarioRegistro = {
  primerNombre: '',
  segundoNombre: '',
  tercerNombre: '',
  primerApellido: '',
  segundoApellido: '',
  correo: '',
  password: '',
  rolId: 2 // Por defecto rol no-admin
};


  constructor(
    private casoService: CasoService,
    private seguimientoService: SeguimientoService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get esAdmin(): boolean {
  return this.usuario?.rol === 'ROLE_ADMIN';
}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarCasos();
  }

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


  
  // --- FILTROS DE CASOS ---
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

  // --- CREAR CASO ---
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
        }, 2500);
      },
      error: (err) => {
        this.guardando = false;
        this.errorFormulario = err.error?.message || 'Error al registrar.';
        this.cdr.detectChanges();
      }
    });
  }

  // --- EDITAR CASO ---
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
        this.mensajeExito = '¡Expediente actualizado correctamente! ✅';
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

  // --- DETALLE CASO ---
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

  // --- BORRAR CASO ---
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
  abrirModalUsuario(): void {
  this.nuevoUsuario = {
    primerNombre: '',
    segundoNombre: '',
    tercerNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    password: '',
    rolId: 2
  };
  this.errorUsuario = '';
  this.mensajeExitoUsuario = '';
  this.mostrarModalUsuario = true;
  this.cdr.detectChanges();
}

cerrarModalUsuario(): void {
  this.mostrarModalUsuario = false;
  this.errorUsuario = '';
  this.mensajeExitoUsuario = '';
  this.cdr.detectChanges();
}

guardarNuevoUsuario(): void {
  if (!this.nuevoUsuario.primerNombre || !this.nuevoUsuario.primerApellido || 
      !this.nuevoUsuario.correo || !this.nuevoUsuario.password) {
    this.errorUsuario = 'Todos los campos son obligatorios.';
    return;
  }

  this.guardandoUsuario = true;
  this.errorUsuario = '';
  this.mensajeExitoUsuario = '';

  this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
    next: () => {
      this.guardandoUsuario = false;
      this.mensajeExitoUsuario = '¡Usuaria creada correctamente! ✅';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.cerrarModalUsuario();
      }, 1200);
    },
    error: (err) => {
      this.guardandoUsuario = false;
      this.errorUsuario = err.error || 'Error al registrar la usuaria.';
      this.cdr.detectChanges();
    }
  });
}

  
  // --- MÓDULO DE SEGUIMIENTOS (BITÁCORA) ---
  
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


  // --- MÓDULO CRUD USUARIAS (ADMIN) ---
 
  abrirGestionUsuarios(): void {
    this.mostrarModalGestionUsuarios = true;
    this.mostrarFormUsuario = false;
    this.filtroUsuario = '';
    this.cargarUsuarios();
  }

  cerrarGestionUsuarios(): void {
    this.mostrarModalGestionUsuarios = false;
    this.mostrarFormUsuario = false;
    this.cdr.detectChanges();
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
        this.cargandoUsuarios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarias', err);
        this.cargandoUsuarios = false;
        this.cdr.detectChanges();
      }
    });
  }

  get usuariosFiltrados(): Usuario[] {
    if (!this.filtroUsuario) return this.listaUsuarios;
    const txt = this.filtroUsuario.toLowerCase();
    return this.listaUsuarios.filter(u =>
      u.primerNombre.toLowerCase().includes(txt) ||
      u.primerApellido.toLowerCase().includes(txt) ||
      u.correo.toLowerCase().includes(txt) ||
      (u.rol?.nombre && u.rol.nombre.toLowerCase().includes(txt))
    );
  }

  iniciarNuevoUsuario(): void {
    this.editandoUsuario = false;
    this.usuarioForm = {
      primerNombre: '',
      segundoNombre: '',
      tercerNombre: '',
      primerApellido: '',
      segundoApellido: '',
      correo: '',
      password: '',
      rolId: 2,
      activo: true
    };
    this.errorUsuario = '';
    this.mensajeExitoUsuario = '';
    this.mostrarFormUsuario = true;
    this.cdr.detectChanges();
  }

  iniciarEdicionUsuario(u: Usuario): void {
    this.editandoUsuario = true;
    this.usuarioForm = {
      id: u.id,
      primerNombre: u.primerNombre,
      segundoNombre: u.segundoNombre,
      tercerNombre: u.tercerNombre,
      primerApellido: u.primerApellido,
      segundoApellido: u.segundoApellido,
      correo: u.correo,
      password: '', // En blanco si no se va a cambiar
      rolId: u.rol?.id || 2,
      activo: u.activo ?? true
    };
    this.errorUsuario = '';
    this.mensajeExitoUsuario = '';
    this.mostrarFormUsuario = true;
    this.cdr.detectChanges();
  }

  cancelarFormUsuario(): void {
    this.mostrarFormUsuario = false;
    this.errorUsuario = '';
    this.mensajeExitoUsuario = '';
    this.cdr.detectChanges();
  }

  guardarUsuario(): void {
  // Solo se exige primerNombre, primerApellido y correo
  if (!this.usuarioForm.primerNombre?.trim() || 
      !this.usuarioForm.primerApellido?.trim() || 
      !this.usuarioForm.correo?.trim()) {
    this.errorUsuario = 'El primer nombre, primer apellido y correo son obligatorios.';
    this.cdr.detectChanges();
    return;
  }

    // Si es nuevo registro, la contraseña es obligatoria
  if (!this.editandoUsuario && !this.usuarioForm.password?.trim()) {
    this.errorUsuario = 'La contraseña temporal es obligatoria para nuevos registros.';
    this.cdr.detectChanges();
    return;
  }

    this.guardando = true;
    this.errorUsuario = '';
    this.mensajeExitoUsuario = '';

    if (this.editandoUsuario && this.usuarioForm.id) {
      this.usuarioService.actualizarUsuario(this.usuarioForm.id, this.usuarioForm).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExitoUsuario = '¡Usuaria actualizada con éxito!';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.mostrarFormUsuario = false;
            this.cargarUsuarios();
          }, 2500);
        },
        error: (err) => {
          this.guardando = false;
          this.errorUsuario = err.error || 'Error al actualizar usuaria.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.usuarioService.crearUsuario(this.usuarioForm).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExitoUsuario = '¡Usuaria registrada con éxito!';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.mostrarFormUsuario = false;
            this.cargarUsuarios();
          }, 2500);
        },
        error: (err) => {
          this.guardando = false;
          this.errorUsuario = err.error || 'Error al registrar usuaria.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  confirmarBorrarUsuario(u: Usuario): void {
    this.usuarioAEliminar = u;
    this.mostrarModalBorrarUsu = true;
    this.cdr.detectChanges();
  }

  cerrarModalBorrarUsu(): void {
    this.mostrarModalBorrarUsu = false;
    this.usuarioAEliminar = null;
    this.cdr.detectChanges();
  }

  ejecutarBorradoUsuario(): void {
    if (!this.usuarioAEliminar?.id) return;
    this.guardando = true;

    this.usuarioService.eliminarUsuario(this.usuarioAEliminar.id).subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModalBorrarUsu();
        this.cargarUsuarios();
      },
      error: () => {
        this.guardando = false;
        alert('Error al desactivar usuaria.');
        this.cerrarModalBorrarUsu();
      }
    });
  }

  ejecutarCambioPassword(): void {
  if (!this.passwordForm.passwordActual || !this.passwordForm.nuevoPassword || !this.passwordForm.confirmarPassword) {
    this.errorPassword = 'Todos los campos son obligatorios.';
    return;
  }

  if (this.passwordForm.nuevoPassword !== this.passwordForm.confirmarPassword) {
    this.errorPassword = 'La nueva contraseña y su confirmación no coinciden.';
    return;
  }

  if (this.passwordForm.nuevoPassword.length < 12) {
    this.errorPassword = 'La nueva contraseña debe tener al menos 12 caracteres.';
    return;
  }

  this.guardandoPassword = true;
  this.errorPassword = '';
  this.mensajeExitoPassword = '';

  this.usuarioService.cambiarPassword(this.usuario.id, {
    passwordActual: this.passwordForm.passwordActual,
    nuevoPassword: this.passwordForm.nuevoPassword
  }).subscribe({
    next: () => {
      this.guardandoPassword = false;
      this.mensajeExitoPassword = '¡Tu contraseña ha sido cambiada exitosamente! ';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.cerrarModalPassword();
      }, 1400);
    },
    error: (err) => {
      this.guardandoPassword = false;
      this.errorPassword = err.error || 'Error al cambiar contraseña.';
      this.cdr.detectChanges();
    }
  });
}
  generarCodigoSugerido(): string {
    const anio = new Date().getFullYear();
    const corr = (this.casos.length + 1).toString().padStart(4, '0');
    return `TOT-${anio}-${corr}`;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

