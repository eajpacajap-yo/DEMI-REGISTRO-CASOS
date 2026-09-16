import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrevencionData } from '../models/prevencion.model';

@Injectable({
  providedIn: 'root'
})
export class PrevencionService {
  private http = inject(HttpClient);
  private readonly url = 'assets/data/prevencion.json';

  obtenerPrevencion(): Observable<PrevencionData> {
    return this.http.get<PrevencionData>(this.url);
  }
}
