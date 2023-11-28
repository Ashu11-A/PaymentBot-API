import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

export class UpdateProductDTO {
  @IsNotEmpty()
    id: string

  @IsString()
  @IsOptional()
    name: string

  @IsString()
  @IsOptional()
    description: string

  @IsNumber()
  @IsOptional()
    price: number

  @IsOptional()
  @IsObject()
    category: {id: string, name?: string }
}
