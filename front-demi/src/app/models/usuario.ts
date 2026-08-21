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
  };
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
}