export interface TextoBilingue {
  es: string;
  quc: string;
}

export type TipoNodo =
  | 'pregunta'
  | 'resultado';

export interface NodoPregunta {

  id: string;

  tipo: 'pregunta';

  pregunta: TextoBilingue;

  descripcion?: TextoBilingue;

  si: string;

  no: string;
}

export interface NodoResultado {

  id: string;

  tipo: 'resultado';

  titulo: TextoBilingue;

  recomendacion: TextoBilingue;

  accion:
    | 'inicio'
    | 'prevencion'
    | 'ruta-denuncia'
    | 'instituciones';

  instituciones: string[];

  nivelUrgencia:
    | 'informativo'
    | 'orientacion';
}

export type NodoDecision =
  | NodoPregunta
  | NodoResultado;

export interface ArbolDecisionData {

  version: number;

  nodoInicial: string;

  nodos: NodoDecision[];

}