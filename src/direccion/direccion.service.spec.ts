import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DireccionService } from './direccion.service';
import { Direccion } from './entities/direccion.entity';

type MockRepo = jest.Mocked<Repository<Direccion>>;
const createMockRepo = (): MockRepo =>
  ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  }) as unknown as MockRepo;

describe('DireccionService', () => {
  let service: DireccionService;
  let repo: MockRepo;
  const mockDir: Direccion = { id: 1, calle: 'San Luis', numero: '323', barrio: 'Parque', ciudad: 'Villa María' } as Direccion;

  beforeEach(async () => {
    repo = createMockRepo();
    const module: TestingModule = await Test.createTestingModule({
      providers: [DireccionService, { provide: getRepositoryToken(Direccion), useValue: repo }],
    }).compile();
    service = module.get<DireccionService>(DireccionService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('findAll', async () => {
    repo.find.mockResolvedValue([mockDir]);
    expect(await service.findAll()).toEqual([mockDir]);
  });

  it('findOne ok', async () => {
    repo.findOneBy.mockResolvedValue(mockDir);
    expect(await service.findOne(1)).toEqual(mockDir);
  });

  it('findOne throws', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create', async () => {
    repo.create.mockReturnValue(mockDir);
    repo.save.mockResolvedValue(mockDir);
    expect(await service.create({ calle: 'San Luis' } as any)).toEqual(mockDir);
  });

  it('update ok', async () => {
    repo.preload.mockResolvedValue(mockDir);
    repo.save.mockResolvedValue(mockDir);
    expect(await service.update(1, { calle: 'Otra' } as any)).toEqual(mockDir);
  });

  it('update throws', async () => {
    repo.preload.mockResolvedValue(null as any);
    await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('remove', async () => {
    repo.findOneBy.mockResolvedValue(mockDir);
    repo.remove.mockResolvedValue(mockDir);
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockDir);
  });
});
