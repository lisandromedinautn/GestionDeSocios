import { Socio } from '../models/socio.model';

export function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export type SortBy = 'apellido' | 'nombre' | 'dni' | 'numeroSocio' | 'estado';
export type SortDir = 'asc' | 'desc';

export function filterSocios(
  socios: Socio[],
  selectedEstadoIds: Set<number>,
  searchTerm: string,
): Socio[] {
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

export function sortSocios(
  socios: Socio[],
  sortBy: SortBy = 'apellido',
  sortDir: SortDir = 'asc',
): Socio[] {
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
      case 'apellido':
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

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
