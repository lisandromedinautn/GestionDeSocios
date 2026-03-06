import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { Caja } from './entities/caja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caja])],
  controllers: [CajaController],
  providers: [CajaService],
})
export class CajaModule {}
