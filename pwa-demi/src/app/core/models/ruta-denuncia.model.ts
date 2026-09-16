export interface TextoI18n {
  es: string;
  quc: string;
}

export interface InstitucionRuta {
  codigo: string;
  nombre: string;
  telefono: string;
  direccion?: string;
}

export interface PasoRuta {
  id: number;
  paso: number;
  titulo: TextoI18n;
  resumen: TextoI18n;
  detalle: TextoI18n;
  instituciones: string[];
}

export interface RutaDenunciaData {
  titulo: TextoI18n;
  descripcion: TextoI18n;
  instituciones: InstitucionRuta[];
  pasos: PasoRuta[];
}