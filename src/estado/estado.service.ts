import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { Estado } from './entities/estado.entity';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async create(createEstadoDto: CreateEstadoDto): Promise<Estado> {
    const nuevoEstado = this.estadoRepository.create(createEstadoDto);
    return await this.estadoRepository.save(nuevoEstado);
  }

  async findAll(): Promise<Estado[]> {
    return await this.estadoRepository.find();
  }

  async findOne(id: number): Promise<Estado> {
    const estado = await this.estadoRepository.findOneBy({ id });
    if (!estado) {
      throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    }
    return estado;
  }

  async update(id: number, updateEstadoDto: UpdateEstadoDto): Promise<Estado> {
    const estado = await this.estadoRepository.preload({
      id: id,
      ...updateEstadoDto,
    });

    if (!estado) {
      throw new NotFoundException(
        `No se puede actualizar: Estado #${id} no existe`,
      );
    }

    return await this.estadoRepository.save(estado);
  }

  async remove(id: number): Promise<void> {
    const estado = await this.findOne(id);
    await this.estadoRepository.remove(estado);
  }
}
