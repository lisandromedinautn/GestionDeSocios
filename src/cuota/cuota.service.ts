import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuota } from './entities/cuota.entity';
import { Socio } from 'src/socio/entities/socio.entity';

@Injectable()
export class CuotaService {
  constructor(
    @InjectRepository(Cuota)
    private readonly cuotaRepository: Repository<Cuota>,
    @InjectRepository(Socio)
    private readonly socioRepository: Repository<Socio>,
  ) {}

  // Buscar todas las cuotas de un socio en un año específico
  async findBySocioAndAnio(socioId: number, anio: number) {
    return await this.cuotaRepository.find({
      where: {
        socio: { id: socioId },
        anio: anio,
      },
      order: { mes: 'ASC' },
    });
  }
  async generarCuotasAnuales(anio: number) {
    // 1. Obtenemos todos los socios (puedes filtrar por estado='Activo' o 'Adherente' si quieres)
    const socios = await this.socioRepository.find();

    const nuevasCuotas: Cuota[] = [];

    for (const socio of socios) {
      // 2. Verificamos si este socio ya tiene cuotas para este año (evita duplicados si se corre 2 veces)
      const existen = await this.cuotaRepository.count({
        where: { socio: { id: socio.id }, anio: anio },
      });

      if (existen === 0) {
        // 3. Generamos los 12 meses en memoria
        for (let mes = 1; mes <= 12; mes++) {
          const cuota = this.cuotaRepository.create({
            mes,
            anio,
            isPagado: false,
            socio: socio,
          });
          nuevasCuotas.push(cuota);
        }
      }
    }

    // 4. Guardamos todas las cuotas generadas de golpe (mucho más rápido en la DB)
    if (nuevasCuotas.length > 0) {
      await this.cuotaRepository.save(nuevasCuotas);
    }

    return {
      mensaje: `Generación completada. Se crearon ${nuevasCuotas.length} cuotas para el año ${anio}.`,
    };
  }

  async togglePago(id: number) {
    const cuota = await this.cuotaRepository.findOneBy({ id });
    if (!cuota) throw new NotFoundException('Cuota no existe');
    cuota.isPagado = !cuota.isPagado;
    return await this.cuotaRepository.save(cuota);
  }
}
