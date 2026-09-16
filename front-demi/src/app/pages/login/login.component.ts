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

  correo: string = '';
  password: string = '';
  cargando: boolean = false;
  errorLogin: string = '';

  // Estados para Recuperación de Contraseña
  mostrarModalRecuperar: boolean = false;
  pasoRecuperacion: number = 1; // 1: Pedir Correo, 2: Pedir PIN y Nueva Clave
  correoRecuperacion: string = '';
  codigoPin: string = '';
  nuevoPasswordRecuperar: string = '';
  confirmarPasswordRecuperar: string = '';
  codigoSugeridoDemostracion: string = '';

  cargandoRecuperacion: boolean = false;
  errorRecuperacion: string = '';
  mensajeExitoRecuperacion: string = '';

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
    this.correoRecuperacion = this.correo; // pre-llenar si ya escribió algo
    this.codigoPin = '';
    this.nuevoPasswordRecuperar = '';
    this.confirmarPasswordRecuperar = '';
    this.codigoSugeridoDemostracion = '';
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
      next: (res) => {
        this.cargandoRecuperacion = false;
        this.codigoSugeridoDemostracion = res.codigoDemostracion;
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

    this.authService.restablecerPassword(this.codigoPin.trim(), this.nuevoPasswordRecuperar).subscribe({
      next: () => {
        this.cargandoRecuperacion = false;
        this.mensajeExitoRecuperacion = '¡Contraseña restablecida exitosamente! ';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cerrarModalRecuperar();
          this.password = '';
        }, 2500);
      },
      error: (err) => {
        this.cargandoRecuperacion = false;
        this.errorRecuperacion = err.error || 'Código incorrecto o expirado.';
        this.cdr.detectChanges();
      }
    });
  }
}