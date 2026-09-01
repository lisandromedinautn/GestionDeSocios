import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CajaService } from './caja.service';
import { Caja } from './entities/caja.entity';

type MockRepo = jest.Mocked<Repository<Caja>>;
const createMockRepo = (): MockRepo =>
  ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  }) as unknown as MockRepo;

describe('CajaService', () => {
  let service: CajaService;
  let repo: MockRepo;
  const mockCaja: Caja = { id: 1, nombre: 'Caja Nación', descripcion: 'test' };

  beforeEach(async () => {
    repo = createMockRepo();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CajaService, { provide: getRepositoryToken(Caja), useValue: repo }],
    }).compile();
    service = module.get<CajaService>(CajaService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('findAll', async () => {
    repo.find.mockResolvedValue([mockCaja]);
    expect(await service.findAll()).toEqual([mockCaja]);
  });

  it('findOne ok', async () => {
    repo.findOneBy.mockResolvedValue(mockCaja);
    expect(await service.findOne(1)).toEqual(mockCaja);
  });

  it('findOne throws', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create', async () => {
    repo.create.mockReturnValue(mockCaja);
    repo.save.mockResolvedValue(mockCaja);
    expect(await service.create({ nombre: 'Caja Nación' } as any)).toEqual(mockCaja);
  });

  it('update ok', async () => {
    repo.preload.mockResolvedValue(mockCaja);
    repo.save.mockResolvedValue(mockCaja);
    expect(await service.update(1, { nombre: 'Otra' } as any)).toEqual(mockCaja);
  });

  it('update throw', async () => {
    repo.preload.mockResolvedValue(null as any);
    await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('remove', async () => {
    repo.findOneBy.mockResolvedValue(mockCaja);
    repo.remove.mockResolvedValue(mockCaja);
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockCaja);
  });
});
