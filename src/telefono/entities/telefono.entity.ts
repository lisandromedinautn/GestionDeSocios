import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('telefonos')
export class Telefono {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  numero!: number;
}
