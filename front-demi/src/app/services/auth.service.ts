import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { JwtResponse } from '../models/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base de Backend en Spring Boot
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(credenciales: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res: JwtResponse) => {
        this.guardarSesion(res);
      })
    );
  }

  private guardarSesion(res: JwtResponse): void {
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('user_data', JSON.stringify({
      id: res.id,
      correo: res.correo,
      nombreCompleto: res.nombreCompleto,
      rol: res.rol
    }));
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUsuario(): any {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  solicitarRecuperacion(correo: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/solicitar-recuperacion`, { correo });
}

restablecerPassword(codigo: string, nuevoPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/restablecer-password`, { codigo, nuevoPassword }, { responseType: 'text' });
}
}