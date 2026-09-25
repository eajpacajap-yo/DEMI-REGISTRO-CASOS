import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IdiomaService } from '../../core/services/idioma';
import { AudioGuiaService } from '../../core/services/audio-guia.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  idiomaService = inject(IdiomaService);
  audioService = inject(AudioGuiaService);

 readonly misionDemi = {
  titulo: {
    es: 'Misión Institucional DEMI',
    quc: 'Reqale\'m ri Rachoch DEMI'
  },
  texto: {
    es: 'Promover, defender y proteger el pleno ejercicio de los derechos de las mujeres indígenas, para contribuir a la erradicación de todas las formas de violencia y discriminación.',
    quc: 'Uya\'ik uchuq\'ab\', uchajixik xuquje\' utob\'axik ri kechb\'al ri ixoqib\' mayab\', rech uq\'atexik ronojel uwach b\'anow k\'ax xuquje\' yoq\'onik.'
  }
};
  reproducirGuiaAudio(): void {
    const rutaAudio = 'assets/audio/inicio.mp3'; 
    this.audioService.toggleAudio(rutaAudio, 'inicio');
  }
 
  
}

