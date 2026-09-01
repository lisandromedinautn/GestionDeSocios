import { Module } from '@nestjs/common';
import { CuotaService } from './cuota.service';
import { CuotaController } from './cuota.controller';
import { Cuota } from './entities/cuota.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socio } from '../socio/entities/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuota, Socio])],
  controllers: [CuotaController],
  providers: [CuotaService],
})
export class CuotaModule {}
