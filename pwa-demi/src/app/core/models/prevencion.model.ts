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
export interface DerechoMujer {
  es: string;
  quc: string;
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
  
  checklist_derechos?: DerechoMujer[];
  tiposViolencia: TipoViolencia[];
}