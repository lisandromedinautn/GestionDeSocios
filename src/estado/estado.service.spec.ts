import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { Estado } from './entities/estado.entity';

type MockRepo = jest.Mocked<Repository<Estado>>;
const createMockRepo = (): MockRepo =>
  ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  }) as unknown as MockRepo;

describe('EstadoService', () => {
  let service: EstadoService;
  let repo: MockRepo;

  const mockEstado: Estado = { id: 1, nombre: 'Adherente', descripcion: 'No Tiene PAMI' };
  const mockEstado2: Estado = { id: 2, nombre: 'Activo', descripcion: 'Tiene PAMI' };

  beforeEach(async () => {
    repo = createMockRepo();
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadoService, { provide: getRepositoryToken(Estado), useValue: repo }],
    }).compile();
    service = module.get<EstadoService>(EstadoService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('findAll should return estados (fuente dinámica para filtro)', async () => {
    repo.find.mockResolvedValue([mockEstado, mockEstado2]);
    const result = await service.findAll();
    expect(result).toEqual([mockEstado, mockEstado2]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('findOne should return estado', async () => {
    repo.findOneBy.mockResolvedValue(mockEstado);
    expect(await service.findOne(1)).toEqual(mockEstado);
  });

  it('findOne should throw if not found', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create should create estado', async () => {
    repo.create.mockReturnValue(mockEstado);
    repo.save.mockResolvedValue(mockEstado);
    const result = await service.create({ nombre: 'Adherente' } as any);
    expect(result).toEqual(mockEstado);
  });

  it('update should preload and save', async () => {
    repo.preload.mockResolvedValue(mockEstado);
    repo.save.mockResolvedValue({ ...mockEstado, nombre: 'Vitalicio' } as Estado);
    const result = await service.update(1, { nombre: 'Vitalicio' } as any);
    expect(result.nombre).toBe('Vitalicio');
  });

  it('update should throw if not found', async () => {
    repo.preload.mockResolvedValue(null as any);
    await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('remove should delete', async () => {
    repo.findOneBy.mockResolvedValue(mockEstado);
    repo.remove.mockResolvedValue(mockEstado);
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockEstado);
  });
});
