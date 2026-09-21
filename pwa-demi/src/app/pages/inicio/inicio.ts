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

  reproducirGuiaAudio(): void {
    const rutaAudio = 'assets/audio/inicio.mp3'; 
    this.audioService.toggleAudio(rutaAudio, 'inicio');
  }
 
  
}

