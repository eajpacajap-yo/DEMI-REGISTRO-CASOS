export interface Usuario {
  id?: number;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  correo: string;
  password?: string;
  activo?: boolean;
  rolId?: number;
  rol?: {
    id: number;
    nombre: string;
  },
  profesion?: string;
  telefono?: String;
}

export interface UsuarioRegistro {
  id?: number;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  correo: string;
  password?: string;
  rolId: number;
  activo?: boolean;
  profesion?: string;
  telefono?: String;
}