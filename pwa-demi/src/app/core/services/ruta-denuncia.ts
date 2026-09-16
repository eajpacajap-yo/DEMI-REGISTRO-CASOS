import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RutaDenunciaData } from '../models/ruta-denuncia.model';

@Injectable({
  providedIn: 'root'
})
export class RutaDenunciaService {
  private http = inject(HttpClient);
  private readonly url = 'assets/data/ruta-denuncia.json';

  obtenerRuta(): Observable<RutaDenunciaData> {
    return this.http.get<RutaDenunciaData>(this.url);
  }
}
