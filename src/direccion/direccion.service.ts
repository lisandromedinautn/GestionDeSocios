import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { Direccion } from './entities/direccion.entity';

@Injectable()
export class DireccionService {
  constructor(
    @InjectRepository(Direccion)
    private readonly direccionRepository: Repository<Direccion>,
  ) {}

  async create(createDireccionDto: CreateDireccionDto): Promise<Direccion> {
    const nuevaDireccion = this.direccionRepository.create(createDireccionDto);
    return await this.direccionRepository.save(nuevaDireccion);
  }

  async findAll(): Promise<Direccion[]> {
    return await this.direccionRepository.find();
  }

  async findOne(id: number): Promise<Direccion> {
    const direccion = await this.direccionRepository.findOneBy({ id });
    if (!direccion) {
      throw new NotFoundException(`Dirección con ID ${id} no encontrada`);
    }
    return direccion;
  }

  async update(
    id: number,
    updateDireccionDto: UpdateDireccionDto,
  ): Promise<Direccion> {
    const direccion = await this.direccionRepository.preload({
      id: id,
      ...updateDireccionDto,
    });

    if (!direccion) {
      throw new NotFoundException(
        `No se pudo actualizar: Dirección #${id} no existe`,
      );
    }

    return await this.direccionRepository.save(direccion);
  }

  async remove(id: number): Promise<void> {
    const direccion = await this.findOne(id);
    await this.direccionRepository.remove(direccion);
  }
}
