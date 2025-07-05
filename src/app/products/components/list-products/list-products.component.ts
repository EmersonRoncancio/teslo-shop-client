import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Products } from '@products/interfaces/getall-products.interface';
import { ProductsMapperType } from '@products/interfaces/products-mapper.interface';
import { ImagesPipe } from '@products/pipes/images.pipe';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-list-products',
  imports: [ImagesPipe, CurrencyPipe, RouterLink],
  templateUrl: './list-products.component.html',
})
export class ListProductsComponent {
  products = input.required<ProductsMapperType>();
}
