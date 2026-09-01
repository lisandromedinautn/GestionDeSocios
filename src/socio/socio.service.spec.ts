import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SocioService } from './socio.service';
import { Socio } from './entities/socio.entity';

type MockRepo = jest.Mocked<Repository<Socio>>;

const createMockRepo = (): MockRepo =>
  ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  }) as unknown as MockRepo;

describe('SocioService', () => {
  let service: SocioService;
  let repo: MockRepo;

  const mockSocio: Socio = {
    id: 1,
    nombre: 'María',
    apellido: 'Caddei',
    dni: 11813930,
    numeroBeneficio: 15072946760400,
    numeroSocio: 385,
    correoElectronico: 'maria@test.com',
    fechaIngreso: new Date('2026-03-04'),
    fechaNacimiento: new Date('1955-07-20'),
    caja: { id: 1, nombre: 'Caja Nación' } as any,
    estado: { id: 2, nombre: 'Activo' } as any,
    telefonos: [],
    cuotas: [],
  } as Socio;

  beforeEach(async () => {
    repo = createMockRepo();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocioService,
        { provide: getRepositoryToken(Socio), useValue: repo },
      ],
    }).compile();

    service = module.get<SocioService>(SocioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return socios with relations', async () => {
      repo.find.mockResolvedValue([mockSocio]);
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['direccion', 'caja', 'estado', 'telefonos'],
      });
      expect(result).toEqual([mockSocio]);
    });
  });

  describe('findOne', () => {
    it('should return socio if found', async () => {
      repo.findOne.mockResolvedValue(mockSocio);
      const result = await service.findOne(1);
      expect(result).toEqual(mockSocio);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['direccion', 'caja', 'estado', 'telefonos'],
      });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save socio', async () => {
      const dto = { nombre: 'Juan', apellido: 'Perez', dni: 123 } as any;
      repo.create.mockReturnValue(mockSocio);
      repo.save.mockResolvedValue(mockSocio);
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockSocio);
      expect(result).toEqual(mockSocio);
    });
  });

  describe('update', () => {
    it('should preload and save', async () => {
      repo.preload.mockResolvedValue(mockSocio);
      repo.save.mockResolvedValue({ ...mockSocio, nombre: 'Actualizado' } as Socio);
      const result = await service.update(1, { nombre: 'Actualizado' } as any);
      expect(repo.preload).toHaveBeenCalledWith({ id: 1, nombre: 'Actualizado' });
      expect(result.nombre).toBe('Actualizado');
    });

    it('should throw if socio not found for update', async () => {
      repo.preload.mockResolvedValue(null as any);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove socio', async () => {
      repo.findOne.mockResolvedValue(mockSocio);
      repo.remove.mockResolvedValue(mockSocio);
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockSocio);
    });
  });
});
