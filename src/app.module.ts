import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { SocioModule } from './socio/socio.module';
import { DireccionModule } from './direccion/direccion.module';
import { CajaModule } from './caja/caja.module';
import { EstadoModule } from './estado/estado.module';
import { TelefonoModule } from './telefono/telefono.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // El archivo se creará automáticamente en la raíz de tu proyecto
      database: 'database.sqlite',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      // synchronize: true crea las tablas automáticamente basado en tus clases @Entity
      // Es perfecto para desarrollo local y un solo usuario
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
