import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  PrevencionData,
  CategoriaPrevencion
} from '../../core/models/prevencion.model';

import {
  PrevencionService
} from '../../core/services/prevencion';

import {
  IdiomaService
} from '../../core/services/idioma';

@Component({
  selector: 'app-prevencion',

  imports: [
    CommonModule
  ],

  templateUrl: './prevencion.html',
  styleUrl: './prevencion.css'
})
export class Prevencion implements OnInit {

  private prevencionService =
    inject(PrevencionService);

  idiomaService =
    inject(IdiomaService);

  datos?: PrevencionData;

  cargando = true;

  error = false;

  categoriaSeleccionada?: CategoriaPrevencion;


  ngOnInit(): void {

    this.prevencionService
      .obtenerContenido()
      .subscribe({

        next: (datos) => {

          this.datos = datos;

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error cargando contenido preventivo:',
            error
          );

          this.error = true;

          this.cargando = false;

        }

      });

  }


  texto(
    texto: {
      es: string;
      quc: string;
    }
  ): string {

    return this.idiomaService.idioma() === 'quc'
      ? texto.quc
      : texto.es;

  }


  seleccionarCategoria(
    categoria: CategoriaPrevencion
  ): void {

    if (
      this.categoriaSeleccionada?.id ===
      categoria.id
    ) {

      this.categoriaSeleccionada =
        undefined;

      return;

    }

    this.categoriaSeleccionada =
      categoria;

  }

}
