import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator'

export class CreateProductDTO {
  @IsNotEmpty()
    name: string
  @IsString()
    description: string
  @IsNumber()
    price: number
  @IsObject()
    category?: { id: string, name?: string }
}
