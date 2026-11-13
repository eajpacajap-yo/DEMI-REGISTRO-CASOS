import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Estados de visibilidad de contraseñas
  mostrarPasswordLogin: boolean = false;
  mostrarPasswordNueva: boolean = false;
  mostrarPasswordConfirmar: boolean = false;

  // Campos de inicio de sesión
  correo: string = '';
  password: string = '';
  cargando: boolean = false;
  errorLogin: string = '';

  // Estados de recuperación de contraseña
  mostrarModalRecuperar: boolean = false;
  pasoRecuperacion: number = 1; // 1: Pedir Correo, 2: Pedir PIN y Nueva Clave
  correoRecuperacion: string = '';
  codigoPin: string = '';
  nuevoPasswordRecuperar: string = '';
  confirmarPasswordRecuperar: string = '';

  cargandoRecuperacion: boolean = false;
  errorRecuperacion: string = '';
  mensajeExitoRecuperacion: string = '';

    togglePasswordLogin(): void {
      this.mostrarPasswordLogin = !this.mostrarPasswordLogin;
    }

togglePasswordNueva(): void {
  this.mostrarPasswordNueva = !this.mostrarPasswordNueva;
}

togglePasswordConfirmar(): void {
  this.mostrarPasswordConfirmar = !this.mostrarPasswordConfirmar;
}

  iniciarSesion(): void {
    if (!this.correo || !this.password) {
      this.errorLogin = 'Por favor complete todos los campos.';
      return;
    }

    this.cargando = true;
    this.errorLogin = '';

    this.authService.login({ correo: this.correo, password: this.password }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/casos']);
      },
      error: (err) => {
        this.cargando = false;
        this.errorLogin = err.error || 'Credenciales inválidas o cuenta inactiva.';
        this.cdr.detectChanges();
      }
    });
  }

  // --- MODAL RECUPERACIÓN ---
  abrirModalRecuperar(): void {
    this.pasoRecuperacion = 1;
    this.correoRecuperacion = this.correo;
    this.codigoPin = '';
    this.nuevoPasswordRecuperar = '';
    this.confirmarPasswordRecuperar = '';
    this.errorRecuperacion = '';
    this.mensajeExitoRecuperacion = '';
    this.mostrarModalRecuperar = true;
    this.cdr.detectChanges();
  }

  cerrarModalRecuperar(): void {
    this.mostrarModalRecuperar = false;
    this.cdr.detectChanges();
  }

  solicitarPin(): void {
    if (!this.correoRecuperacion.trim()) {
      this.errorRecuperacion = 'Ingrese su correo institucional.';
      return;
    }

    this.cargandoRecuperacion = true;
    this.errorRecuperacion = '';
    this.mensajeExitoRecuperacion = '';

    this.authService.solicitarRecuperacion(this.correoRecuperacion.trim()).subscribe({
      next: (res: any) => {
        this.cargandoRecuperacion = false;
        this.mensajeExitoRecuperacion = res?.mensaje || 'Se ha enviado un código de seguridad a su correo.';
        this.pasoRecuperacion = 2;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargandoRecuperacion = false;
        this.errorRecuperacion = err.error || 'No se encontró una cuenta con ese correo.';
        this.cdr.detectChanges();
      }
    });
  }

  confirmarRestablecimiento(): void {
    if (!this.codigoPin.trim() || !this.nuevoPasswordRecuperar || !this.confirmarPasswordRecuperar) {
      this.errorRecuperacion = 'Complete el código PIN y ambas contraseñas.';
      return;
    }

    if (this.nuevoPasswordRecuperar !== this.confirmarPasswordRecuperar) {
      this.errorRecuperacion = 'Las contraseñas ingresadas no coinciden.';
      return;
    }

    if (this.nuevoPasswordRecuperar.length < 12) {
      this.errorRecuperacion = 'La contraseña debe tener al menos 12 caracteres.';
      return;
    }

    this.cargandoRecuperacion = true;
    this.errorRecuperacion = '';
    this.mensajeExitoRecuperacion = '';
    this.cdr.detectChanges();

    // Llama al servicio enviando el código y la nueva contraseña
    this.authService.restablecerPassword({
      codigo: this.codigoPin.trim(),
      nuevoPassword: this.nuevoPasswordRecuperar.trim()
    }).subscribe({
      next: (res: any) => {
        this.cargandoRecuperacion = false;
        this.mensajeExitoRecuperacion = typeof res === 'string' ? res : '¡Contraseña restablecida exitosamente!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cerrarModalRecuperar();
          this.password = '';
        }, 2200);
      },
      error: (err) => {
        this.cargandoRecuperacion = false;
        this.errorRecuperacion = err.error || 'Código incorrecto o expirado.';
        this.cdr.detectChanges();
      }
    });
  }
}