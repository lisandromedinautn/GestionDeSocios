import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DireccionService } from './direccion.service';
import { DireccionController } from './direccion.controller';
import { Direccion } from './entities/direccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Direccion])],
  controllers: [DireccionController],
  providers: [DireccionService],
  exports: [DireccionService], // 💡 Tip: Expórtalo para usarlo luego en Socios
})
export class DireccionModule {}
