import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('direcciones')
export class Direccion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  calle!: string;

  @Column()
  numero!: string;

  @Column({ nullable: true })
  piso?: string;

  @Column({ nullable: true })
  departamento?: string;

  @Column()
  barrio!: string;

  @Column()
  ciudad!: string;
}
