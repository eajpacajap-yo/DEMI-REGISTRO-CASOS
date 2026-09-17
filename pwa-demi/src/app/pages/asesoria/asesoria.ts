import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArbolDecisionData, NodoDecision, OpcionDecision } from '../../core/models/arbol-decision.model';
import { AsesoriaService } from '../../core/services/asesoria';
import { IdiomaService } from '../../core/services/idioma';
import { AudioGuiaService } from '../../core/services/audio-guia.service';
@Component({
  selector: 'app-asesoria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './asesoria.html',
  styleUrl: './asesoria.css'
})
export class Asesoria implements OnInit {
  audioService = inject(AudioGuiaService);
  private asesoriaService = inject(AsesoriaService);
  idiomaService = inject(IdiomaService);

  datos?: ArbolDecisionData;
  nodoActual?: NodoDecision;
  historial: NodoDecision[] = [];
  cargando = true;
  error = false;

  ngOnInit(): void {
    this.asesoriaService.obtenerArbol().subscribe({
      next: (datos) => {
        this.datos = datos;
        this.iniciarArbol();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando el árbol de decisión:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  iniciarArbol(): void {
    this.historial = [];
    if (this.datos && this.datos.nodos) {
      const raiz = this.datos.nodo_raiz || 'N0';
      this.nodoActual = this.buscarNodo(raiz);
    }
  }

  buscarNodo(id: string): NodoDecision | undefined {
    if (!this.datos || !this.datos.nodos) return undefined;
    return this.datos.nodos[id];
  }

  seleccionarOpcion(opcion: OpcionDecision): void {
    if (this.nodoActual && opcion.siguiente) {
      this.historial.push(this.nodoActual);
      this.nodoActual = this.buscarNodo(opcion.siguiente);
    }
  }

  regresarPaso(): void {
    if (this.historial.length > 0) {
      this.nodoActual = this.historial.pop();
    }
  }

  texto(t?: { es: string; quc: string }): string {
    if (!t) return '';
    return this.idiomaService.idioma() === 'quc' ? t.quc : t.es;
  }
   reproducirGuiaAudio(): void {
    const rutaAudio = 'assets/audio/guia-asesoria-quc.mp3'; 
    this.audioService.toggleAudio(rutaAudio, 'ruta-denuncia');
  }

}