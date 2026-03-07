export interface Direccion {
  id?: number;
  calle: string;
  numero: string;
  barrio: string;
  ciudad: string;
}

export interface Telefono {
  id?: number;
  numero: string;
}

export interface Caja {
  id: number;
  nombre?: string;
}

export interface Estado {
  id: number;
  nombre?: string;
}

export interface Socio {
  id?: number;
  nombre: string;
  apellido: string;
  dni: number;
  numeroBeneficio: string;
  numeroSocio: number;
  correoElectronico: string;
  fechaIngreso: string | Date;
  fechaNacimiento: string | Date;
  direccion?: Direccion;
  caja: Caja;
  estado: Estado;
  telefonos: Telefono[];
}