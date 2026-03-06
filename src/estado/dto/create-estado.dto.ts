import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
