import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common/dto';

import { PRODUCTS_SERVICE } from 'tokens';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE)
    private readonly productsService: ClientProxy,
  ) { }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.send({ cmd: 'create-product' }, createProductDto);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsService.send({ cmd: 'find-all-products' }, paginationDto);
  }

  @Get(':id')
  async findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.send({ cmd: 'find-product-by-id' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.send({ cmd: 'update-product' }, { id, ...updateProductDto }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.send({ cmd: 'delete-product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }
}
