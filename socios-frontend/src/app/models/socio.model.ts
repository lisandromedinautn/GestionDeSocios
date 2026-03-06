export interface Direccion {
  calle: string;
  numero: string;
  barrio: string;
  ciudad: string;
}

export interface Telefono {
  numero: string;
}

export interface Socio {
  id?: number;
  nombre: string;
  apellido: string;
  dni: number;
  correoElectronico: string;
  direccion?: Direccion;
  telefonos?: Telefono[];
}
