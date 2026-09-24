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
    es: 'En DEMI proporcionamos atención, servicio y asesoría jurídica, social y psicológica a mujeres indígenas víctimas de cualquier tipo de violencia, física, emocional y sexual, así como discriminación étnica.',
    quc: "Pa DEMI kaya' tojob'anem, patanib'al k'at'anob'al tzij pa reqale'm q'atbal tzij, winaqilal ruk' xib'inik anima' chke ri ixoqib' e ajwareal ri xkiriq pokonal pa jachinab'al ya'b'al k'ax, pa ch'akab'il, pa xib'inik ruk' pa makunik, jachaq'amik rumal kib'antajik."
  };
  
  reproducirGuiaAudio(): void {
    const rutaAudio = 'assets/audio/inicio.mp3'; 
    this.audioService.toggleAudio(rutaAudio, 'inicio');
  }
 
  
}

