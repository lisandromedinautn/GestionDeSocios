import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CuotaService } from './cuota.service';

@Controller('cuota')
export class CuotaController {
  constructor(private readonly cuotaService: CuotaService) {}

  // Usamos ParseIntPipe para socioId y anio
  @Get(':socioId/:anio')
  findAnual(
    @Param('socioId', ParseIntPipe) socioId: number,
    @Param('anio', ParseIntPipe) anio: number,
  ) {
    return this.cuotaService.findBySocioAndAnio(socioId, anio);
  }

  @Patch('toggle/:id')
  toggle(@Param('id', ParseIntPipe) id: number) {
    return this.cuotaService.togglePago(id);
  }

  @Post('generar-cuotas/:anio')
  async generarCuotasDelAnio(@Param('anio', ParseIntPipe) anio: number) {
    return await this.cuotaService.generarCuotasAnuales(anio);
  }
}
