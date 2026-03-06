import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('caja')
export class Caja {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;
}
