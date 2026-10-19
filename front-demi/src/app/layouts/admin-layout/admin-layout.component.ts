import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  usuario: any = null;

  // Variables para Modal de Contraseña
  mostrarModalPassword = false;
  guardandoPassword = false;
  errorPassword = '';
  mensajeExitoPassword = '';

  passwordForm = {
    passwordActual: '',
    nuevoPassword: '',
    confirmarPassword: ''
  };

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
  }

  get esAdmin(): boolean {
    return this.usuario?.rol === 'ROLE_ADMIN';
  }

  // Lógica de Contraseña
  abrirModalPassword(): void {
    this.passwordForm = { passwordActual: '', nuevoPassword: '', confirmarPassword: '' };
    this.errorPassword = '';
    this.mensajeExitoPassword = '';
    this.mostrarModalPassword = true;
    this.cdr.detectChanges();
  }

  cerrarModalPassword(): void {
    this.mostrarModalPassword = false;
    this.cdr.detectChanges();
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
    
    this.usuarioService.cambiarPassword(this.usuario.id, {
      passwordActual: this.passwordForm.passwordActual,
      nuevoPassword: this.passwordForm.nuevoPassword
    }).subscribe({
      next: () => {
        this.guardandoPassword = false;
        this.mensajeExitoPassword = '¡Contraseña actualizada!';
        this.cdr.detectChanges();
        setTimeout(() => this.cerrarModalPassword(), 1500);
      },
      error: (err) => {
        this.guardandoPassword = false;
        this.errorPassword = err.error || 'Error al cambiar contraseña.';
        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}