export interface TipoViolencia {
  id: string;
  titulo: {
    es: string;
    quc: string;
  };
  descripcion: {
    es: string;
    quc: string;
  };
  senales: Array<{
    es: string;
    quc: string;
  }>;
}

export interface PrevencionData {
  titulo: {
    es: string;
    quc: string;
  };
  descripcion: {
    es: string;
    quc: string;
  };
  tiposViolencia: TipoViolencia[];
}