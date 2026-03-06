import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { Caja } from './entities/caja.entity';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
  ) {}

  async create(createCajaDto: CreateCajaDto): Promise<Caja> {
    const nuevaCaja = this.cajaRepository.create(createCajaDto);
    return await this.cajaRepository.save(nuevaCaja);
  }

  async findAll(): Promise<Caja[]> {
    return await this.cajaRepository.find();
  }

  async findOne(id: number): Promise<Caja> {
    const caja = await this.cajaRepository.findOneBy({ id });
    if (!caja) {
      throw new NotFoundException(`La caja con ID ${id} no fue encontrada`);
    }
    return caja;
  }

  async update(id: number, updateCajaDto: UpdateCajaDto): Promise<Caja> {
    // preload busca la entidad y le aplica los cambios del DTO
    const caja = await this.cajaRepository.preload({
      id: id,
      ...updateCajaDto,
    });

    if (!caja) {
      throw new NotFoundException(
        `No se pudo actualizar: Caja #${id} no existe`,
      );
    }

    return await this.cajaRepository.save(caja);
  }

  async remove(id: number): Promise<void> {
    const caja = await this.findOne(id); // Reutilizamos findOne para validar que exista
    await this.cajaRepository.remove(caja);
  }
}
