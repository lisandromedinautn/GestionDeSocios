import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TelefonoService } from './telefono.service';
import { Telefono } from './entities/telefono.entity';

type MockRepo = jest.Mocked<Repository<Telefono>>;
const createMockRepo = (): MockRepo =>
  ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  }) as unknown as MockRepo;

describe('TelefonoService', () => {
  let service: TelefonoService;
  let repo: MockRepo;
  const mockTel: Telefono = { id: 1, numero: 3534081139 } as Telefono;

  beforeEach(async () => {
    repo = createMockRepo();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelefonoService, { provide: getRepositoryToken(Telefono), useValue: repo }],
    }).compile();
    service = module.get<TelefonoService>(TelefonoService);
  });

  it('should be defined', () => expect(service).toBeDefined());
  it('findAll', async () => {
    repo.find.mockResolvedValue([mockTel]);
    expect(await service.findAll()).toEqual([mockTel]);
  });
  it('findOne ok', async () => {
    repo.findOneBy.mockResolvedValue(mockTel);
    expect(await service.findOne(1)).toEqual(mockTel);
  });
  it('findOne throws', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
  it('create', async () => {
    repo.create.mockReturnValue(mockTel);
    repo.save.mockResolvedValue(mockTel);
    expect(await service.create({ numero: 3534081139 } as any)).toEqual(mockTel);
  });
  it('update ok', async () => {
    repo.preload.mockResolvedValue(mockTel);
    repo.save.mockResolvedValue(mockTel);
    expect(await service.update(1, { numero: 1 } as any)).toEqual(mockTel);
  });
  it('update throws', async () => {
    repo.preload.mockResolvedValue(null as any);
    await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
  });
  it('remove', async () => {
    repo.findOneBy.mockResolvedValue(mockTel);
    repo.remove.mockResolvedValue(mockTel);
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockTel);
  });
});
