export interface SeguimientoCaso {
  id?: number;
  casoId?: number;
  usuarioId?: number;
  etapaProcesal: string;
  descripcionAvance: string;
  fechaAtencion?: string;
  usuario?: {
    id: number;
    primerNombre: string;
    primerApellido: string;
    rol?: { nombre: string };
  };
}