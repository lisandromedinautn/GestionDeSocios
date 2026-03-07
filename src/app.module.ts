import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioModule } from './socio/socio.module';
import { DireccionModule } from './direccion/direccion.module';
import { CajaModule } from './caja/caja.module';
import { EstadoModule } from './estado/estado.module';
import { TelefonoModule } from './telefono/telefono.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    SocioModule,
    DireccionModule,
    CajaModule,
    EstadoModule,
    TelefonoModule,
  ],
})
export class AppModule {}
