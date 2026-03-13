import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Socio } from '../../socio/entities/socio.entity';

@Entity('cuotas')
export class Cuota {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mes!: number;

  @Column()
  anio!: number;

  @Column({ default: false })
  isPagado!: boolean;

  @ManyToOne(() => Socio, (socio) => socio.cuotas, { onDelete: 'CASCADE' })
  socio!: Socio;
}
