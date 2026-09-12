import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ArbolDecisionData
} from '../models/arbol-decision.model';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {

  private readonly url =
    '/assets/data/arbol-decision.json';

  constructor(
    private http: HttpClient
  ) {}

  obtenerArbol(): Observable<ArbolDecisionData> {

    return this.http.get<ArbolDecisionData>(
      this.url
    );

  }

}
