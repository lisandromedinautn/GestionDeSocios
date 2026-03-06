import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;
}
