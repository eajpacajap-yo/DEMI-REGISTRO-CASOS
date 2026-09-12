export interface TextoBilingue {
  es: string;
  quc: string;
}

export interface PasoRuta {
  id: number;
  orden: number;
  titulo: TextoBilingue;
  descripcion: TextoBilingue;
  icono: string;
  instituciones: string[];
}

export interface InstitucionRuta {
  codigo: string;
  nombre: string;
  descripcion: TextoBilingue;
}

export interface RutaDenunciaData {
  version: number;
  titulo: TextoBilingue;
  descripcion: TextoBilingue;
  pasos: PasoRuta[];
  instituciones: InstitucionRuta[];
}