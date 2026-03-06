import {
  IsString,
  IsEmail,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDireccionDto } from '../../direccion/dto/create-direccion.dto';

export class CreateSocioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsNumber()
  @IsNotEmpty()
  dni!: number;

  @IsString()
  @IsNotEmpty()
  numeroBeneficio!: string;

  @IsNumber()
  numeroSocio!: number;

  @IsNotEmpty()
  @IsEmail()
  correoElectronico!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaIngreso!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaNacimiento!: string;

  // Validamos que la dirección sea un objeto que cumpla con su propio DTO
  @IsObject()
  @ValidateNested()
  @Type(() => CreateDireccionDto)
  direccion!: CreateDireccionDto;

  // Para relaciones simples, podemos recibir solo el ID o el objeto
  @IsNotEmpty()
  caja: any;

  @IsNotEmpty()
  estado: any;

  @IsArray()
  @IsOptional()
  telefonos?: any[];
}
