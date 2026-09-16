export interface OpcionDecision {
  texto: {
    es: string;
    quc: string;
  };
  color?: string;
  siguiente: string;
}

export interface NodoDecision {
  id: string;
  tipo: 'pregunta' | 'conclusion';
  urgencia?: 'alta' | 'media' | 'baja';
  pregunta?: {
    es: string;
    quc: string;
  };
  recomendacion?: {
    es: string;
    quc: string;
  };
  institucion_contacto?: {
    nombre: string;
    telefono: string;
  };
  acciones?: Array<{
    es: string;
    quc: string;
  }>;
  opciones?: OpcionDecision[];
}

export interface ArbolDecisionData {
  nodo_raiz: string;
  disclaimer: {
    es: string;
    quc: string;
  };
  nodos: Record<string, NodoDecision>;
}