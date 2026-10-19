import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario, UsuarioRegistro } from '../../models/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarias.component.html',
  styleUrls: ['./usuarias.component.css']
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  usuarioActual: any = null;
  cargandoUsuarios = true;
  listaUsuarios: Usuario[] = [];
  filtroUsuario = '';

  mostrarFormUsuario = false;
  editandoUsuario = false;
  guardando = false;

  usuarioForm: UsuarioRegistro = {
    primerNombre: '', segundoNombre: '', tercerNombre: '',
    primerApellido: '', segundoApellido: '',
    correo: '', password: '', rolId: 2, activo: true,
    profesion: ''
  };
  
  errorUsuario = '';
  mensajeExitoUsuario = '';
  
  mostrarModalBorrarUsu = false;
  usuarioAEliminar: Usuario | null = null;

  rolesDisponibles = [
    { id: 1, nombre: 'Administradora (ROLE_ADMIN)' },
    { id: 2, nombre: 'Profesional de Atención (ROLE_PROFESIONAL)' }
  ];

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUsuario();
    this.cargarUsuarios();
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
      u.correo.toLowerCase().includes(txt)
    );
  }

  iniciarNuevoUsuario(): void {
    this.editandoUsuario = false;
    this.usuarioForm = {
      primerNombre: '', segundoNombre: '', tercerNombre: '',
      primerApellido: '', segundoApellido: '',
      correo: '', password: '', rolId: 2, activo: true,
      profesion: ''
    };
    this.errorUsuario = '';
    this.mensajeExitoUsuario = '';
    this.mostrarFormUsuario = true;
  }

  iniciarEdicionUsuario(u: Usuario): void {
    this.editandoUsuario = true;
    this.usuarioForm = {
      id: u.id,
      primerNombre: u.primerNombre, segundoNombre: u.segundoNombre, tercerNombre: u.tercerNombre,
      primerApellido: u.primerApellido, segundoApellido: u.segundoApellido,
      correo: u.correo, password: '', rolId: u.rol?.id || 2, activo: u.activo ?? true , profesion: u.profesion
    };
    this.errorUsuario = '';
    this.mensajeExitoUsuario = '';
    this.mostrarFormUsuario = true;
  }

  cancelarFormUsuario(): void {
    this.mostrarFormUsuario = false;
    this.errorUsuario = '';
  }

  guardarUsuario(): void {
    if (!this.usuarioForm.primerNombre || !this.usuarioForm.primerApellido || !this.usuarioForm.correo) {
      this.errorUsuario = 'Nombre, apellido y correo son obligatorios.';
      return;
    }

    this.guardando = true;
    if (this.editandoUsuario && this.usuarioForm.id) {
      this.usuarioService.actualizarUsuario(this.usuarioForm.id, this.usuarioForm).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExitoUsuario = '¡Usuaria actualizada!';
          setTimeout(() => { this.mostrarFormUsuario = false; this.cargarUsuarios(); }, 1500);
        },
        error: (err) => { this.guardando = false; this.errorUsuario = err.error || 'Error al actualizar'; }
      });
    } else {
      this.usuarioService.crearUsuario(this.usuarioForm).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExitoUsuario = '¡Usuaria registrada!';
          setTimeout(() => { this.mostrarFormUsuario = false; this.cargarUsuarios(); }, 1500);
        },
        error: (err) => { this.guardando = false; this.errorUsuario = err.error || 'Error al registrar'; }
      });
    }
  }

  confirmarBorrarUsuario(u: Usuario): void {
    this.usuarioAEliminar = u;
    this.mostrarModalBorrarUsu = true;
  }

  cerrarModalBorrarUsu(): void {
    this.mostrarModalBorrarUsu = false;
    this.usuarioAEliminar = null;
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
}