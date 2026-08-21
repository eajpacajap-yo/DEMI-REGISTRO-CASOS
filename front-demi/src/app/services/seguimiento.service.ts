import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeguimientoCaso } from '../models/seguimiento';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  private apiUrl = 'http://localhost:8080/api/seguimientos';

  constructor(private http: HttpClient) { }

  listarPorCaso(casoId: number): Observable<SeguimientoCaso[]> {
    return this.http.get<SeguimientoCaso[]>(`${this.apiUrl}/caso/${casoId}`);
  }

  crearSeguimiento(seguimiento: SeguimientoCaso): Observable<SeguimientoCaso> {
    return this.http.post<SeguimientoCaso>(this.apiUrl, seguimiento);
  }

  actualizarSeguimiento(id: number, seguimiento: SeguimientoCaso): Observable<SeguimientoCaso> {
    return this.http.put<SeguimientoCaso>(`${this.apiUrl}/${id}`, seguimiento);
  }

  eliminarSeguimiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}