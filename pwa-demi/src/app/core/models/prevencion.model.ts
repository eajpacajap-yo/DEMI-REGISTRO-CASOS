export interface TextoBilingue {
  es: string;
  quc: string;
}

export interface ContenidoPrevencion {
  id: number;
  titulo: TextoBilingue;
  texto: TextoBilingue;
}

export interface CategoriaPrevencion {
  id: number;
  codigo: string;
  titulo: TextoBilingue;
  descripcion: TextoBilingue;
  icono: string;
  contenidos: ContenidoPrevencion[];
}

export interface PrevencionData {
  version: number;
  titulo: TextoBilingue;
  descripcion: TextoBilingue;
  categorias: CategoriaPrevencion[];
}