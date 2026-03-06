import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioController } from './socio.controller';

@Module({
  controllers: [SocioController],
  providers: [SocioService],
})
export class SocioModule {}
