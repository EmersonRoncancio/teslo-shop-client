import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ListProductsComponent } from '@products/components/list-products/list-products.component';
import { ProductsServiceService } from '@products/services/products-service.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-page',
  imports: [ListProductsComponent, PaginationComponent, RouterLink],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  productService = inject(ProductsServiceService);
  paginationService = inject(PaginationService);
  page = this.paginationService.activateRoute;
  pageSizeSignal = signal('10');

  resourcePrtoducts = rxResource({
    params: () => ({ page: this.page() - 1, pageSize: this.pageSizeSignal() }),
    stream: ({ params }) => {
      return this.productService.getAllProducts({
        offset: params.page * 9,
        limit: +this.pageSizeSignal(),
      });
    },
  });
}
