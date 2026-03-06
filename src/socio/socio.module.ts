import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioService } from './socio.service';
import { SocioController } from './socio.controller';
import { Socio } from './entities/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Socio])],
  controllers: [SocioController],
  providers: [SocioService],
})
export class SocioModule {}
