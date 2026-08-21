export interface Caso {
  id?: number;
  codigoExpediente: string;
  municipioId?: number;
  localidad: string;
  tipoViolenciaId?: number;
  estadoId?: number;
  usuarioRegistroId?: number;
  municipio?: { id: number; nombre: string };
  tipoViolencia?: { id: number; nombre: string };
  estado?: { id: number; nombre: string };
  usuarioRegistro?: { id: number; primerNombre: string; primerApellido: string };
  fechaRegistro?: string;
  creadoEn?: string;
}