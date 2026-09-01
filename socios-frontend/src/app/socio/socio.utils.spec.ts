import { filterSocios, sortSocios, paginate, normalize, getTotalPages } from './socio.utils';
import { Socio } from '../models/socio.model';

const socios: Socio[] = [
  { id: 1, nombre: 'María', apellido: 'Caddei', dni: 11813930, numeroBeneficio: 1, numeroSocio: 385, correoElectronico: 'a@a.com', fechaIngreso: '2026-01-01', fechaNacimiento: '1955-01-01', caja: { id: 1 }, estado: { id: 2, nombre: 'Activo' }, telefonos: [] },
  { id: 2, nombre: 'Juan', apellido: 'Perez', dni: 22333444, numeroBeneficio: 2, numeroSocio: 10, correoElectronico: 'b@b.com', fechaIngreso: '2026-01-01', fechaNacimiento: '1990-01-01', caja: { id: 1 }, estado: { id: 1, nombre: 'Adherente' }, telefonos: [] },
  { id: 3, nombre: 'José', apellido: 'Gonzalez', dni: 33444555, numeroBeneficio: 3, numeroSocio: 20, correoElectronico: 'c@c.com', fechaIngreso: '2026-01-01', fechaNacimiento: '1990-01-01', caja: { id: 1 }, estado: { id: 2, nombre: 'Activo' }, telefonos: [] },
  { id: 4, nombre: 'Ana', apellido: 'Lopez', dni: 44555666, numeroBeneficio: 4, numeroSocio: 30, correoElectronico: 'd@d.com', fechaIngreso: '2026-01-01', fechaNacimiento: '1990-01-01', caja: { id: 1 }, estado: { id: 1, nombre: 'Adherente' }, telefonos: [] },
];

describe('normalize', () => {
  it('remueve tildes y pasa a minusculas', () => {
    expect(normalize('María')).toBe('maria');
    expect(normalize('JOSÉ')).toBe('jose');
    expect(normalize('González')).toBe('gonzalez');
  });
});

describe('filterSocios - filtro complejo', () => {
  it('sin filtro muestra todos (dinámico)', () => {
    expect(filterSocios(socios, new Set(), '')).toHaveLength(4);
  });

  it('filtro por estado OR', () => {
    expect(filterSocios(socios, new Set([1]), '')).toHaveLength(2);
    expect(filterSocios(socios, new Set([2]), '')).toHaveLength(2);
    expect(filterSocios(socios, new Set([1, 2]), '')).toHaveLength(4);
  });

  it('filtro dinámico no hardcodeado: nuevo estado Vitalicio', () => {
    const sociosConNuevo = [...socios, { id: 5, nombre: 'Pedro', apellido: 'Sosa', dni: 999, numeroBeneficio: 5, numeroSocio: 99, correoElectronico: 'x@x.com', fechaIngreso: '2026-01-01', fechaNacimiento: '1990-01-01', caja: { id: 1 }, estado: { id: 99, nombre: 'Vitalicio' }, telefonos: [] } as Socio];
    expect(filterSocios(sociosConNuevo, new Set([99]), '')).toHaveLength(1);
  });

  it('búsqueda startWith con tildes', () => {
    expect(filterSocios(socios, new Set(), 'maria')).toHaveLength(1); // María Caddei (nombre)
    expect(filterSocios(socios, new Set(), 'María')).toHaveLength(1);
    expect(filterSocios(socios, new Set(), 'cad')).toHaveLength(1);
    expect(filterSocios(socios, new Set(), 'addei')).toHaveLength(0); // no startWith
  });

  it('búsqueda respeta filtros activos AND', () => {
    // Adherente + jose -> solo Ana? No, Juan Perez no es jose, Lopez no. Solo 0? Wait: Jose y Josefina no están, con estos datos jose trae 1 (Gonzalez Activo) pero filtrado por Adherente da 0
    const res = filterSocios(socios, new Set([1]), 'jose');
    expect(res).toHaveLength(0);
    const res2 = filterSocios(socios, new Set([2]), 'jose');
    expect(res2).toHaveLength(1);
    expect(res2[0].apellido).toBe('Gonzalez');
  });

  it('búsqueda por dni startWith', () => {
    expect(filterSocios(socios, new Set(), '118')).toHaveLength(1);
    expect(filterSocios(socios, new Set(), '1813930')).toHaveLength(0);
  });
});

describe('sortSocios', () => {
  it('default apellido asc', () => {
    const sorted = sortSocios(socios, 'apellido', 'asc');
    expect(sorted.map((s) => s.apellido)).toEqual(['Caddei', 'Gonzalez', 'Lopez', 'Perez']);
  });
  it('sort por nombre', () => {
    const sorted = sortSocios(socios, 'nombre', 'asc');
    expect(sorted[0].nombre).toBe('Ana');
  });
  it('sort desc', () => {
    const sorted = sortSocios(socios, 'apellido', 'desc');
    expect(sorted[0].apellido).toBe('Perez');
  });
});

describe('paginate y getTotalPages', () => {
  it('20 por defecto', () => {
    expect(getTotalPages(103, 20)).toBe(6);
    expect(getTotalPages(0, 20)).toBe(1);
  });
  it('slice correcto', () => {
    const sorted = sortSocios(socios, 'apellido', 'asc');
    expect(paginate(sorted, 1, 2)).toHaveLength(2);
    expect(paginate(sorted, 2, 2)).toHaveLength(2);
    expect(paginate(sorted, 3, 2)).toHaveLength(0);
  });
});
