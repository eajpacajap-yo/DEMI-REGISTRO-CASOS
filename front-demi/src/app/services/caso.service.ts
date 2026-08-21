import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Caso } from '../models/caso';

@Injectable({
  providedIn: 'root'
})
export class CasoService {

  private apiUrl = 'http://localhost:8080/api/casos';

  constructor(private http: HttpClient) { }

  listarCasos(): Observable<Caso[]> {
    return this.http.get<Caso[]>(this.apiUrl);
  }

  obtenerCasoPorId(id: number): Observable<Caso> {
    return this.http.get<Caso>(`${this.apiUrl}/${id}`);
  }

  crearCaso(caso: Caso): Observable<Caso> {
    return this.http.post<Caso>(this.apiUrl, caso);
  }

  actualizarCaso(id: number, caso: Caso): Observable<Caso> {
    return this.http.put<Caso>(`${this.apiUrl}/${id}`, caso);
  }

  eliminarCaso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}