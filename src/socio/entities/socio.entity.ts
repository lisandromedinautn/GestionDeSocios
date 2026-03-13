import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany, // <--- Asegúrate de importar esto
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Caja } from '../../caja/entities/caja.entity';
import { Estado } from '../../estado/entities/estado.entity';
import { Direccion } from '../../direccion/entities/direccion.entity';
import { Telefono } from '../../telefono/entities/telefono.entity';
import { Cuota } from '../../cuota/entities/cuota.entity'; // Ajusta la ruta si es necesario

@Entity('socios')
export class Socio {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  dni!: number;

  @Column()
  numeroBeneficio!: number;

  @Column({ unique: true })
  numeroSocio!: number;

  @Column()
  correoElectronico!: string;

  @Column({ type: 'date' })
  fechaIngreso!: Date;

  @Column({ type: 'date' })
  fechaNacimiento!: Date;

  // --- RELACIONES ---

  @ManyToOne(() => Direccion, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'direccionId' })
  direccion?: Direccion;

  @ManyToOne(() => Caja)
  caja!: Caja;

  @ManyToOne(() => Estado)
  estado!: Estado;

  @ManyToMany(() => Telefono, { cascade: true })
  @JoinTable({
    name: 'socio_telefonos',
    joinColumn: { name: 'socio_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'telefono_id', referencedColumnName: 'id' },
  })
  telefonos!: Telefono[];


  @OneToMany(() => Cuota, (cuota) => cuota.socio)
  cuotas!: Cuota[]; 
}