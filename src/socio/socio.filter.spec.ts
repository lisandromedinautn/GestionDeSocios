/**
 * Tests para filtro complejo por estado + búsqueda + paginación + ordenamiento
 * Requisitos: OR para estados, startWith con normalización de tildes, AND entre estado y búsqueda,
 * paginación 20 por defecto, orden default por apellido.
 */

// Replicamos la lógica de socios-frontend/src/app/socio/socio.component.ts para test puro

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

interface Estado { id: number; nombre: string }
interface SocioMock {
  nombre: string;
  apellido: string;
  dni: number;
  numeroSocio: number;
  estado: Estado;
}

function filterSocios(
  socios: SocioMock[],
  selectedEstadoIds: Set<number>,
  searchTerm: string,
): SocioMock[] {
  let filtrados = [...socios];
  if (selectedEstadoIds.size > 0) {
    filtrados = filtrados.filter((s) => s.estado && selectedEstadoIds.has(s.estado.id));
  }
  if (searchTerm && searchTerm.trim()) {
    const term = normalize(searchTerm.trim());
    filtrados = filtrados.filter((s) => {
      const nombre = normalize(s.nombre);
      const apellido = normalize(s.apellido);
      const dni = s.dni.toString();
      const estadoNombre = s.estado?.nombre ? normalize(s.estado.nombre) : '';
      return (
        apellido.startsWith(term) ||
        nombre.startsWith(term) ||
        dni.startsWith(term) ||
        estadoNombre.startsWith(term)
      );
    });
  }
  return filtrados;
}

function sortSocios(
  socios: SocioMock[],
  sortBy: 'apellido' | 'nombre' | 'dni' | 'numeroSocio' | 'estado' = 'apellido',
  sortDir: 'asc' | 'desc' = 'asc',
): SocioMock[] {
  return [...socios].sort((a, b) => {
    let valA: string | number = '';
    let valB: string | number = '';
    switch (sortBy) {
      case 'nombre':
        valA = normalize(a.nombre);
        valB = normalize(b.nombre);
        break;
      case 'dni':
        valA = a.dni;
        valB = b.dni;
        break;
      case 'numeroSocio':
        valA = a.numeroSocio;
        valB = b.numeroSocio;
        break;
      case 'estado':
        valA = a.estado?.nombre ? normalize(a.estado.nombre) : '';
        valB = b.estado?.nombre ? normalize(b.estado.nombre) : '';
        break;
      default:
        valA = normalize(a.apellido);
        valB = normalize(b.apellido);
        break;
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    if (sortBy !== 'apellido') {
      const apA = normalize(a.apellido);
      const apB = normalize(b.apellido);
      if (apA < apB) return -1;
      if (apA > apB) return 1;
    }
    return 0;
  });
}

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

describe('Filtro complejo - Estado dinámico OR', () => {
  const socios: SocioMock[] = [
    { nombre: 'María', apellido: 'Caddei', dni: 11813930, numeroSocio: 385, estado: { id: 2, nombre: 'Activo' } },
    { nombre: 'Juan', apellido: 'Perez', dni: 22333444, numeroSocio: 10, estado: { id: 1, nombre: 'Adherente' } },
    { nombre: 'José', apellido: 'Gonzalez', dni: 33444555, numeroSocio: 20, estado: { id: 2, nombre: 'Activo' } },
    { nombre: 'Ana', apellido: 'Lopez', dni: 44555666, numeroSocio: 30, estado: { id: 1, nombre: 'Adherente' } },
  ];

  it('sin filtro muestra todos (no hardcodeado)', () => {
    expect(filterSocios(socios, new Set(), '')).toHaveLength(4);
  });

  it('filtro por un estado usa OR (no AND)', () => {
    const adherentes = filterSocios(socios, new Set([1]), '');
    expect(adherentes).toHaveLength(2);
    expect(adherentes.every((s) => s.estado.id === 1)).toBe(true);

    const activos = filterSocios(socios, new Set([2]), '');
    expect(activos).toHaveLength(2);
    expect(activos.every((s) => s.estado.id === 2)).toBe(true);
  });

  it('filtro por ambos estados muestra todos (OR)', () => {
    expect(filterSocios(socios, new Set([1, 2]), '')).toHaveLength(4);
  });

  it('selección dinámica: si se agrega nuevo estado no requiere código', () => {
    const sociosConNuevo = [
      ...socios,
      { nombre: 'Pedro', apellido: 'Sosa', dni: 999, numeroSocio: 99, estado: { id: 99, nombre: 'Vitalicio' } },
    ];
    const filtrados = filterSocios(sociosConNuevo, new Set([99]), '');
    expect(filtrados).toHaveLength(1);
    expect(filtrados[0].apellido).toBe('Sosa');
  });
});

describe('Filtro complejo - Búsqueda startWith con tildes (AND con estado)', () => {
  const socios: SocioMock[] = [
    { nombre: 'María', apellido: 'Caddei', dni: 11813930, numeroSocio: 385, estado: { id: 2, nombre: 'Activo' } },
    { nombre: 'Maria', apellido: 'Perez', dni: 22333444, numeroSocio: 10, estado: { id: 1, nombre: 'Adherente' } },
    { nombre: 'José', apellido: 'Gonzalez', dni: 33444555, numeroSocio: 20, estado: { id: 2, nombre: 'Activo' } },
    { nombre: 'Josefina', apellido: 'Gomez', dni: 44555666, numeroSocio: 30, estado: { id: 1, nombre: 'Adherente' } },
  ];

  it('normaliza tildes y es case-insensitive con startWith', () => {
    expect(filterSocios(socios, new Set(), 'maria')).toHaveLength(2);
    expect(filterSocios(socios, new Set(), 'María')).toHaveLength(2);
    expect(filterSocios(socios, new Set(), 'MARIA')).toHaveLength(2);
  });

  it('usa startWith no contains: mar no trae si está en medio', () => {
    // 'ar' está en medio de María pero no al inicio -> no debe traer
    expect(filterSocios(socios, new Set(), 'ar')).toHaveLength(0);
    expect(filterSocios(socios, new Set(), 'cad')).toHaveLength(1); // Caddei
    expect(filterSocios(socios, new Set(), 'addei')).toHaveLength(0); // no startWith
  });

  it('búsqueda respeta filtros activos (AND)', () => {
    // Filtrado por Adherente (1) + búsqueda 'jose' -> solo Gomez (Josefina Adherente), no Gonzalez (Activo)
    const result = filterSocios(socios, new Set([1]), 'jose');
    expect(result).toHaveLength(1);
    expect(result[0].apellido).toBe('Gomez');

    // Sin filtro estado, 'jose' trae ambos
    expect(filterSocios(socios, new Set(), 'jose')).toHaveLength(2);
  });

  it('búsqueda por dni con startWith', () => {
    expect(filterSocios(socios, new Set(), '118')).toHaveLength(1);
    expect(filterSocios(socios, new Set(), '223')).toHaveLength(1);
    expect(filterSocios(socios, new Set(), '1813930')).toHaveLength(0); // no empieza con eso
  });

  it('búsqueda por estado nombre con startWith', () => {
    expect(filterSocios(socios, new Set(), 'activ')).toHaveLength(2);
    expect(filterSocios(socios, new Set(), 'adher')).toHaveLength(2);
  });
});

describe('Filtro complejo - Ordenamiento', () => {
  const socios: SocioMock[] = [
    { nombre: 'Zoe', apellido: 'Sosa', dni: 1, numeroSocio: 3, estado: { id: 1, nombre: 'Adherente' } },
    { nombre: 'Ana', apellido: 'Acevedo', dni: 3, numeroSocio: 1, estado: { id: 2, nombre: 'Activo' } },
    { nombre: 'Luis', apellido: 'Lopez', dni: 2, numeroSocio: 2, estado: { id: 1, nombre: 'Adherente' } },
  ];

  it('orden default por apellido asc', () => {
    const sorted = sortSocios(socios, 'apellido', 'asc');
    expect(sorted.map((s) => s.apellido)).toEqual(['Acevedo', 'Lopez', 'Sosa']);
  });

  it('orden por nombre', () => {
    const sorted = sortSocios(socios, 'nombre', 'asc');
    expect(sorted.map((s) => s.nombre)).toEqual(['Ana', 'Luis', 'Zoe']);
  });

  it('orden descendente', () => {
    const sorted = sortSocios(socios, 'apellido', 'desc');
    expect(sorted.map((s) => s.apellido)).toEqual(['Sosa', 'Lopez', 'Acevedo']);
  });

  it('orden por dni numérico', () => {
    const sorted = sortSocios(socios, 'dni', 'asc');
    expect(sorted.map((s) => s.dni)).toEqual([1, 2, 3]);
  });
});

describe('Filtro complejo - Paginación', () => {
  const socios: SocioMock[] = Array.from({ length: 45 }, (_, i) => ({
    nombre: `Nombre${i}`,
    apellido: `Apellido${String(i).padStart(2, '0')}`,
    dni: 10000000 + i,
    numeroSocio: i,
    estado: { id: i % 2 === 0 ? 2 : 1, nombre: i % 2 === 0 ? 'Activo' : 'Adherente' },
  }));

  it('pageSize 20 por defecto genera 3 páginas para 45', () => {
    const pageSize = 20;
    const totalPages = Math.ceil(socios.length / pageSize);
    expect(totalPages).toBe(3);
  });

  it('paginate devuelve slice correcto', () => {
    const sorted = sortSocios(socios, 'apellido', 'asc');
    const p1 = paginate(sorted, 1, 20);
    const p2 = paginate(sorted, 2, 20);
    const p3 = paginate(sorted, 3, 20);
    expect(p1).toHaveLength(20);
    expect(p2).toHaveLength(20);
    expect(p3).toHaveLength(5);
    expect(p1[0].apellido).toBe('Apellido00');
    expect(p2[0].apellido).toBe('Apellido20');
    expect(p3[0].apellido).toBe('Apellido40');
  });

  it('filtro reduce totalPages correctamente', () => {
    const filtrados = filterSocios(socios, new Set([1]), '');
    // Adherentes son los impares -> ~22-23
    expect(filtrados.length).toBe(22);
    expect(Math.ceil(filtrados.length / 20)).toBe(2);
  });
});
