import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDireccionDto {
  @IsString() @IsNotEmpty() calle!: string;
  @IsString() @IsNotEmpty() numero!: string;
  @IsString() @IsOptional() piso?: string;
  @IsString() @IsOptional() departamento?: string;
  @IsString() @IsNotEmpty() barrio!: string;
  @IsString() @IsNotEmpty() ciudad!: string;
}
