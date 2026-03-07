import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTelefonoDto {
  @IsString()
  @IsNotEmpty()
  numero!: number;
}
