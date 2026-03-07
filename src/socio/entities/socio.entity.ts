import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Caja } from '../../caja/entities/caja.entity';
import { Estado } from '../../estado/entities/estado.entity';
import { Direccion } from '../../direccion/entities/direccion.entity';
import { Telefono } from '../../telefono/entities/telefono.entity';

@Entity('socios')
export class Socio {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true }) // El DNI no debería repetirse
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

  // --- RELACIONES (Foreign Keys) ---

  // Muchos socios pueden vivir en la misma dirección (o puedes usar @OneToOne si es estricto)
  @ManyToOne(() => Direccion, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'direccionId' })
  direccion?: Direccion;

  // Muchos socios pertenecen a una Caja
  @ManyToOne(() => Caja)
  caja!: Caja;

  // Muchos socios tienen un Estado ("Activo", "Deudor", etc.)
  @ManyToOne(() => Estado)
  estado!: Estado;

  // Relación Muchos a Muchos (Tabla intermedia socio x telefono)
  @ManyToMany(() => Telefono, { cascade: true }) // <-- Asegúrate de tener cascade: true
  @JoinTable({
    name: 'socio_telefonos',
    joinColumn: { name: 'socio_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'telefono_id', referencedColumnName: 'id' },
  })
  telefonos!: Telefono[];
}
