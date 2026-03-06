import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTelefonoDto } from './dto/create-telefono.dto';
import { UpdateTelefonoDto } from './dto/update-telefono.dto';
import { Telefono } from './entities/telefono.entity';

@Injectable()
export class TelefonoService {
  constructor(
    @InjectRepository(Telefono)
    private readonly telefonoRepository: Repository<Telefono>,
  ) {}

  async create(createTelefonoDto: CreateTelefonoDto): Promise<Telefono> {
    const nuevoTelefono = this.telefonoRepository.create(createTelefonoDto);
    return await this.telefonoRepository.save(nuevoTelefono);
  }

  async findAll(): Promise<Telefono[]> {
    return await this.telefonoRepository.find();
  }

  async findOne(id: number): Promise<Telefono> {
    const telefono = await this.telefonoRepository.findOneBy({ id });
    if (!telefono) {
      throw new NotFoundException(`Teléfono con ID ${id} no encontrado`);
    }
    return telefono;
  }

  async update(
    id: number,
    updateTelefonoDto: UpdateTelefonoDto,
  ): Promise<Telefono> {
    const telefono = await this.telefonoRepository.preload({
      id: id,
      ...updateTelefonoDto,
    });

    if (!telefono) {
      throw new NotFoundException(
        `No se pudo actualizar: Teléfono #${id} no existe`,
      );
    }

    return await this.telefonoRepository.save(telefono);
  }

  async remove(id: number): Promise<void> {
    const telefono = await this.findOne(id);
    await this.telefonoRepository.remove(telefono);
  }
}
