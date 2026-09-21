import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaAdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/recursos';

  subirRecurso(formData: FormData): Observable<any> {
    // Si el interceptor no añade el token automáticamente:
    const token = localStorage.getItem('token_jwt') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/admin/subir`, formData, { headers });
  }
}