import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  ArbolDecisionData,
  NodoDecision,
  NodoPregunta,
  NodoResultado
} from '../../core/models/arbol-decision.model';

import {
  AsesoriaService
} from '../../core/services/asesoria';

import {
  IdiomaService
} from '../../core/services/idioma';

@Component({
  selector: 'app-asesoria',

  imports: [],

  templateUrl: './asesoria.html',

  styleUrl: './asesoria.css'
})
export class Asesoria implements OnInit {

  private asesoriaService =
    inject(AsesoriaService);

  private router =
    inject(Router);

  idiomaService =
    inject(IdiomaService);


  datos?: ArbolDecisionData;

  nodoActual?: NodoDecision;

  cargando = true;

  error = false;

  historial: string[] = [];


  ngOnInit(): void {

    this.asesoriaService
      .obtenerArbol()
      .subscribe({

        next: (datos) => {

          this.datos = datos;

          this.iniciarArbol();

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error cargando árbol de decisión:',
            error
          );

          this.error = true;

          this.cargando = false;

        }

      });

  }


  iniciarArbol(): void {

    if (!this.datos) {
      return;
    }

    this.historial = [];

    this.nodoActual =
      this.buscarNodo(
        this.datos.nodoInicial
      );

  }


  buscarNodo(
    id: string
  ): NodoDecision | undefined {

    return this.datos?.nodos.find(
      nodo => nodo.id === id
    );

  }


  responder(
    respuesta: boolean
  ): void {

    if (
      !this.nodoActual ||
      this.nodoActual.tipo !== 'pregunta'
    ) {
      return;
    }

    const nodoPregunta =
      this.nodoActual as NodoPregunta;


    this.historial.push(
      nodoPregunta.id
    );


    const siguienteId =
      respuesta
        ? nodoPregunta.si
        : nodoPregunta.no;


    const siguienteNodo =
      this.buscarNodo(
        siguienteId
      );


    if (siguienteNodo) {

      this.nodoActual =
        siguienteNodo;

    }

  }


  regresar(): void {

    const nodoAnterior =
      this.historial.pop();

    if (!nodoAnterior) {
      return;
    }

    this.nodoActual =
      this.buscarNodo(
        nodoAnterior
      );

  }


  reiniciar(): void {

    this.iniciarArbol();

  }


  texto(
    texto: {
      es: string;
      quc: string;
    }
  ): string {

    return this.idiomaService.idioma() ===
      'quc'
        ? texto.quc
        : texto.es;

  }


  esPregunta(
    nodo: NodoDecision
  ): nodo is NodoPregunta {

    return nodo.tipo === 'pregunta';

  }


  esResultado(
    nodo: NodoDecision
  ): nodo is NodoResultado {

    return nodo.tipo === 'resultado';

  }


  irAResultado(
    resultado: NodoResultado
  ): void {

    switch (
      resultado.accion
    ) {

      case 'prevencion':

        this.router.navigate([
          '/prevencion'
        ]);

        break;


      case 'ruta-denuncia':

        this.router.navigate([
          '/ruta-denuncia'
        ]);

        break;


      case 'instituciones':

        this.router.navigate([
          '/instituciones'
        ]);

        break;


      default:

        this.router.navigate([
          '/inicio'
        ]);

    }

  }

}