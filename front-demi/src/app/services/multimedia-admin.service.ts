import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecursoAdmin {
  id: number;
  titulo: string;
  tipoRecurso: string;
  moduloPwa: string;
  idiomaId: number;
  rutaAlmacenamiento: string;
  descripcionEs?: string;
  descripcionQuc?: string;
  activo: boolean;
  creadoEn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MultimediaAdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/recursos';

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('token_jwt') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 1. Subir nueva imagen (Multipart)
  subirRecurso(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/subir`, formData, { 
      headers: this.obtenerHeaders() 
    });
  }

  // 2. Obtener todas las imágenes cargadas para mostrarlas en la tabla
  obtenerTodos(): Observable<RecursoAdmin[]> {
    return this.http.get<RecursoAdmin[]>(`${this.apiUrl}/admin/todos`, { 
      headers: this.obtenerHeaders() 
    });
  }

  // 3. Modificar datos de una imagen (título, descripción, módulo o visibilidad)
  actualizarRecurso(id: number, datos: Partial<RecursoAdmin>): Observable<RecursoAdmin> {
    return this.http.put<RecursoAdmin>(`${this.apiUrl}/admin/actualizar/${id}`, datos, { 
      headers: this.obtenerHeaders() 
    });
  }

  // 4. Eliminar el recurso de la base de datos y del disco
  eliminarRecurso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/eliminar/${id}`, { 
      headers: this.obtenerHeaders() 
    });
  }
}