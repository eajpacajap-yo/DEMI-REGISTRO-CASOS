import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  RutaDenunciaData,
  PasoRuta,
  InstitucionRuta
} from '../../core/models/ruta-denuncia.model';

import {
  RutaDenunciaService
} from '../../core/services/ruta-denuncia';

import {
  IdiomaService
} from '../../core/services/idioma';

@Component({
  selector: 'app-ruta-denuncia',

  imports: [
    CommonModule
  ],

  templateUrl: './ruta-denuncia.html',
  styleUrl: './ruta-denuncia.css'
})
export class RutaDenuncia implements OnInit {

  private rutaService =
    inject(RutaDenunciaService);

  idiomaService =
    inject(IdiomaService);

  datos?: RutaDenunciaData;

  cargando = true;

  error = false;

  pasoSeleccionado?: PasoRuta;


  ngOnInit(): void {

    this.rutaService
      .obtenerRuta()
      .subscribe({

        next: (datos) => {

          this.datos = datos;

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error cargando la ruta crítica:',
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


  seleccionarPaso(paso: PasoRuta): void {

    if (
      this.pasoSeleccionado?.id === paso.id
    ) {

      this.pasoSeleccionado = undefined;

      return;

    }

    this.pasoSeleccionado = paso;

  }


  obtenerInstitucion(
    codigo: string
  ): InstitucionRuta | undefined {

    return this.datos?.instituciones.find(
      institucion =>
        institucion.codigo === codigo
    );

  }

}
