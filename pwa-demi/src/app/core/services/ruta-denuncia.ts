import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RutaDenunciaData } from '../models/ruta-denuncia.model';

@Injectable({
  providedIn: 'root'
})
export class RutaDenunciaService {

  private readonly url =
    '/assets/data/ruta-denuncia.json';

  constructor(
    private http: HttpClient
  ) {}

  obtenerRuta(): Observable<RutaDenunciaData> {
    return this.http.get<RutaDenunciaData>(this.url);
  }
}
