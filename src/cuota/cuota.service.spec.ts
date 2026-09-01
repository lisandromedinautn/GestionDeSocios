import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuotaService } from './cuota.service';
import { Cuota } from './entities/cuota.entity';
import { Socio } from '../socio/entities/socio.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepo<T> = jest.Mocked<Repository<T>>;
const createMockRepo = <T>(): MockRepo<T> =>
  ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }) as unknown as MockRepo<T>;

describe('CuotaService', () => {
  let service: CuotaService;
  let cuotaRepo: MockRepo<Cuota>;
  let socioRepo: MockRepo<Socio>;

  beforeEach(async () => {
    cuotaRepo = createMockRepo<Cuota>();
    socioRepo = createMockRepo<Socio>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuotaService,
        { provide: getRepositoryToken(Cuota), useValue: cuotaRepo },
        { provide: getRepositoryToken(Socio), useValue: socioRepo },
      ],
    }).compile();
    service = module.get<CuotaService>(CuotaService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('findBySocioAndAnio', () => {
    it('should find cuotas ordered by mes ASC', async () => {
      const mockCuotas = [{ mes: 1 }, { mes: 2 }] as Cuota[];
      cuotaRepo.find.mockResolvedValue(mockCuotas);
      const result = await service.findBySocioAndAnio(1, 2026);
      expect(cuotaRepo.find).toHaveBeenCalledWith({
        where: { socio: { id: 1 }, anio: 2026 },
        order: { mes: 'ASC' },
      });
      expect(result).toEqual(mockCuotas);
    });
  });

  describe('generarCuotasAnuales', () => {
    it('should generate 12 cuotas per socio if none exist', async () => {
      const socio = { id: 1 } as Socio;
      socioRepo.find.mockResolvedValue([socio]);
      cuotaRepo.count.mockResolvedValue(0);
      cuotaRepo.create.mockImplementation((dto) => dto as Cuota);
      cuotaRepo.save.mockResolvedValue([] as any);

      const result = await service.generarCuotasAnuales(2026);
      expect(cuotaRepo.create).toHaveBeenCalledTimes(12);
      expect(cuotaRepo.save).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ mes: 1, anio: 2026 })]));
      expect(result.mensaje).toContain('12 cuotas');
    });

    it('should not generate if already exist', async () => {
      const socio = { id: 1 } as Socio;
      socioRepo.find.mockResolvedValue([socio]);
      cuotaRepo.count.mockResolvedValue(12);
      const result = await service.generarCuotasAnuales(2026);
      expect(cuotaRepo.create).not.toHaveBeenCalled();
      expect(result.mensaje).toContain('0 cuotas');
    });
  });

  describe('togglePago', () => {
    it('should toggle isPagado', async () => {
      const cuota = { id: 1, isPagado: false } as Cuota;
      cuotaRepo.findOneBy.mockResolvedValue(cuota);
      cuotaRepo.save.mockResolvedValue({ ...cuota, isPagado: true } as Cuota);
      const result = await service.togglePago(1);
      expect(result.isPagado).toBe(true);
    });

    it('should throw if not found', async () => {
      cuotaRepo.findOneBy.mockResolvedValue(null);
      await expect(service.togglePago(999)).rejects.toThrow(NotFoundException);
    });
  });
});
