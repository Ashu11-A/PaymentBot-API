import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FilterProductDTO } from './dto/filter-product.dto'
import { Product } from '@prisma/client'
import { CreateProductDTO } from './dto/create-product.dto'
import { UpdateProductDTO } from './dto/update-product.dto'

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService
  ){}

  async createProduct(createProductDTO: CreateProductDTO) {
    const { category, name, price, description } = createProductDTO
    const product = await this.prisma.product.create({ data: { name, price, description }})

    if (category) {
      await this.prisma.productCategory.create({
        data: {
          product: { connect: { id: product.id } },
          category: { connect: { id: category.id } }
        }
      })
    }
    return product
  }

  async updateProduct(updateProductDTO: UpdateProductDTO): Promise<Product> {
    const { id, category, name, price, description } = updateProductDTO
    const existProduct = await this.prisma.product.findUnique({ where: { id } })

    if (existProduct) {
      let updateProduct = await this.prisma.product.update({
        where: { id },
        data: { name, price, description }
      })

      if (category) updateProduct = await this.prisma.product.update({
        where: { id },
        data: { ProductCategory: { connect: { id: category.id}} }
      })
      return updateProduct
    } else {
      throw new HttpException('❌ Produto não encontrado!', HttpStatus.NOT_FOUND)
    }
  }

  async deleteProduct(id: string) {
    const existProduct = await this.prisma.product.findUnique({ where: { id } })

    if (existProduct) {
      const deleteProduct = await this.prisma.product.delete({ where: { id } })
      return deleteProduct
    } else {
      throw new HttpException('❌ Produto não encontrado!', HttpStatus.NOT_FOUND)
    }
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    return product
  }

  async getAllProduct() {
    const products = await this.prisma.product.findMany()
    return products
  }

  async getFilteredProducts(filterProductDTO: FilterProductDTO): Promise<Product[]> {
    const { category, search } = filterProductDTO
    let products = await this.prisma.product.findMany({
      include: {
        ProductCategory: {
          select: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (search) {
      products = products.filter(product =>
        product.name.includes(search) ||
        product.description.includes(search)
      )
    }
    if (category) products = products.filter(product => product.ProductCategory)
    return products
  }

}
