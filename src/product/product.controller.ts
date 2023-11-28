import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req } from '@nestjs/common'
import { IsPublic } from 'src/auth/decorator/pass.decorator'
import { CreateProductDTO } from './dto/create-product.dto'
import { FilterProductDTO } from './dto/filter-product.dto'
import { UpdateProductDTO } from './dto/update-product.dto'
import { ProductService } from './product.service'

@IsPublic()
@Controller('store/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ){}

  @Post()
  async create(@Body() createProductDTO: CreateProductDTO) {
    console.log(createProductDTO)
    return this.productService.createProduct(createProductDTO)
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  async update(@Body() updateProductDTO: UpdateProductDTO) {
    return this.productService.updateProduct(updateProductDTO)
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async delete(@Req() req: { body: { id: string } }) {
    return this.productService.deleteProduct(req.body.id)
  }

  @Get()
  async all(@Query() filterProductDTO: FilterProductDTO) {
    if (Object.keys(filterProductDTO).length) {
      return this.productService.getFilteredProducts(filterProductDTO)
    }
    return this.productService.getAllProduct()
  }
}
