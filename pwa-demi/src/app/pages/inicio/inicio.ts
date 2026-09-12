import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IdiomaService } from '../../core/services/idioma';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {

  idiomaService = inject(IdiomaService);

}
