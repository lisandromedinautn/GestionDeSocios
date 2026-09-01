import { TestBed } from '@angular/core/testing';
import { SocioComponent } from './socio.component';
import { SocioService } from '../services/socio.service';
import { EstadoService } from '../services/estado.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('SocioComponent - filtro complejo', () => {
  let component: SocioComponent;
  let socioServiceMock: jest.Mocked<SocioService>;
  let estadoServiceMock: jest.Mocked<EstadoService>;

  const mockSocios = [
    { id: 1, nombre: 'María', apellido: 'Caddei', dni: 11813930, numeroBeneficio: 1, numeroSocio: 385, correoElectronico: 'a@a.com', fechaIngreso: '2026-01-01', fechaNacimiento: '1955-01-01', caja: { id: 1 }, estado: { id: 2, nombre: 'Activo' }, telefonos: [] },
    { id: 2, nombre: 'Juan', apellido: 'Perez', dni: 22333444, numeroBeneficio: 2, numeroSocio: 10, correoElectronico: 'b@b.com', fechaIngreso: '2026-01-01', fechaNacimiento: '1990-01-01', caja: { id: 1 }, estado: { id: 1, nombre: 'Adherente' }, telefonos: [] },
    { id: 3, nombre: 'José', apellido: 'Gonzalez', dni: 33444555, numeroBeneficio: 3, numeroSocio: 20, correoElectronico: 'c@c.com', fechaIngreso: '2026-01-01', fechaNacimiento: '1990-01-01', caja: { id: 1 }, estado: { id: 2, nombre: 'Activo' }, telefonos: [] },
  ] as any;

  const mockEstados = [
    { id: 1, nombre: 'Adherente' },
    { id: 2, nombre: 'Activo' },
  ] as any;

  beforeEach(async () => {
    socioServiceMock = {
      getSocios: jest.fn().mockReturnValue(of(mockSocios)),
      deleteSocio: jest.fn(),
    } as unknown as jest.Mocked<SocioService>;

    estadoServiceMock = {
      findAll: jest.fn().mockReturnValue(of(mockEstados)),
    } as unknown as jest.Mocked<EstadoService>;

    await TestBed.configureTestingModule({
      imports: [SocioComponent],
      providers: [
        provideRouter([]),
        { provide: SocioService, useValue: socioServiceMock },
        { provide: EstadoService, useValue: estadoServiceMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load socios and estados dinámicos (no hardcode)', () => {
    expect(socioServiceMock.getSocios).toHaveBeenCalled();
    expect(estadoServiceMock.findAll).toHaveBeenCalled();
    expect(component.estados).toEqual(mockEstados);
    expect(component.socios).toEqual(mockSocios);
  });

  it('filtro por estado OR sin hardcode', () => {
    component.selectedEstadoIds = new Set([1]);
    expect(component.sociosFiltrados).toHaveLength(1);
    expect(component.sociosFiltrados[0].apellido).toBe('Perez');

    component.selectedEstadoIds = new Set([1, 2]);
    expect(component.sociosFiltrados).toHaveLength(3);
  });

  it('búsqueda startWith con tildes y AND con estado', () => {
    component.selectedEstadoIds = new Set([2]);
    component.searchTerm = 'mar';
    // María Caddei Activo empieza con mar -> 1
    expect(component.sociosFiltrados).toHaveLength(1);
    expect(component.sociosFiltrados[0].nombre).toBe('María');

    component.selectedEstadoIds = new Set([1]);
    component.searchTerm = 'mar';
    expect(component.sociosFiltrados).toHaveLength(0); // Adherente no tiene mar

    component.selectedEstadoIds = new Set();
    component.searchTerm = 'María'; // con tilde
    expect(component.sociosFiltrados).toHaveLength(1);
  });

  it('paginación 20 por defecto', () => {
    expect(component.pageSize).toBe(20);
    expect(component.totalPages).toBe(1);
    expect(component.sociosPaginados).toHaveLength(3);

    component.pageSize = 2;
    expect(component.totalPages).toBe(2);
    expect(component.sociosPaginados).toHaveLength(2);
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.sociosPaginados).toHaveLength(1);
  });

  it('ordenamiento default apellido', () => {
    expect(component.sortBy).toBe('apellido');
    const sorted = component.sociosFiltrados.map((s) => s.apellido);
    expect(sorted).toEqual(['Caddei', 'Gonzalez', 'Perez']);
  });

  it('toggleEstado y clear resetean página', () => {
    component.currentPage = 3;
    component.toggleEstado(1);
    expect(component.currentPage).toBe(1);
    component.currentPage = 3;
    component.clearEstadoFilter();
    expect(component.selectedEstadoIds.size).toBe(0);
    expect(component.currentPage).toBe(1);
  });
});
