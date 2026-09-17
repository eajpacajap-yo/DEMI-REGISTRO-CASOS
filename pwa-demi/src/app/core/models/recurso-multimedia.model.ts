export interface Idioma {
  id: number;
  codigo_iso: 'es' | 'quc';
  nombre: string;
  activo: boolean;
}

export interface RecursoMultimedia {
  id: number;
  titulo: string;
  tipo_recurso: 'AUDIO' | 'IMAGEN';
  idioma_id: number;
  tipo_violencia_id?: number;
  modulo_pwa: 'ruta-denuncia' | 'prevencion' | 'asesoria' | 'galeria';
  ruta_almacenamiento: string;
  checksum_hash?: string;
  version: number;
  activo: boolean;
  blob?: Blob; // Propiedad en memoria para IndexedDB
}

export interface RecursoGaleriaVisual {
  id: number;
  titulo: { es: string; quc: string };
  descripcion: { es: string; quc: string };
  imagen_url: string;
  categoria: string;
}