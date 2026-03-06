import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelefonoService } from './telefono.service';
import { TelefonoController } from './telefono.controller';
import { Telefono } from './entities/telefono.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Telefono])],
  controllers: [TelefonoController],
  providers: [TelefonoService],
  exports: [TelefonoService], // Importante para la relación ManyToMany con Socio
})
export class TelefonoModule {}
