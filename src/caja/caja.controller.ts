import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';

@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Post()
  create(@Body() createCajaDto: CreateCajaDto) {
    return this.cajaService.create(createCajaDto);
  }

  @Get()
  findAll() {
    return this.cajaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cajaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCajaDto: UpdateCajaDto,
  ) {
    return this.cajaService.update(id, updateCajaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cajaService.remove(id);
  }
}
