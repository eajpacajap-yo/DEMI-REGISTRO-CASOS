import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResumenReporte {
  totalCasos: number;
  casosPorMunicipio: { [key: string]: number };
  casosPorTipoViolencia: { [key: string]: number };
  casosPorEstado: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/reportes';

  obtenerResumen(): Observable<ResumenReporte> {
    const token = localStorage.getItem('token') || localStorage.getItem('token_jwt') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<ResumenReporte>(`${this.apiUrl}/resumen`, { headers });
  }
}