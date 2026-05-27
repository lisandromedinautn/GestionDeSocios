import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { Socio } from './entities/socio.entity';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(Socio)
    private readonly socioRepository: Repository<Socio>,
  ) {}

  async create(createSocioDto: CreateSocioDto): Promise<Socio> {
    try {
      // Usar el método .create() es vital porque mapea el DTO a la clase Entidad
      // detectando qué objetos son relaciones.
      const nuevoSocio = this.socioRepository.create(createSocioDto);
      console.log('Nuevo socio creado (antes de guardar):', nuevoSocio);

      return await this.socioRepository.save(nuevoSocio);
    } catch (error) {
      // Esto te ayudará a ver si es un error de BD o de TypeORM
      console.error('Error detallado:', error);
      throw error;
    }
  }

  async findAll(): Promise<Socio[]> {
    // Usamos 'relations' para que traiga los datos de las otras tablas
    // Si no pones esto, los campos direccion, caja, etc. vendrán vacíos
    return await this.socioRepository.find({
      relations: ['direccion', 'caja', 'estado', 'telefonos'],
    });
  }

  async findOne(id: number): Promise<Socio> {
    const socio = await this.socioRepository.findOne({
      where: { id },
      relations: ['direccion', 'caja', 'estado', 'telefonos'],
    });

    if (!socio) {
      throw new NotFoundException(`Socio con ID ${id} no encontrado`);
    }
    return socio;
  }

  async update(id: number, updateSocioDto: UpdateSocioDto): Promise<Socio> {
    const socio = await this.socioRepository.preload({
      id: id,
      ...updateSocioDto,
    });

    if (!socio) {
      throw new NotFoundException(
        `No se pudo actualizar: Socio #${id} no existe`,
      );
    }
    console.log('socio actualizado:', socio);
    return await this.socioRepository.save(socio);
  }

  async remove(id: number): Promise<void> {
    const socio = await this.findOne(id);
    await this.socioRepository.remove(socio);
  }
}
