import { Component, inject, signal } from '@angular/core';
import { ProductsServiceService } from '@products/services/products-service.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';
import { CardProductComponent } from '../../components/card-product/card-product.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ProductsMapperType } from '@products/interfaces/products-mapper.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [CardProductComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  paginationService = inject(ProductsServiceService);
  productsService = inject(ProductsServiceService);
  route = this.paginationService.activateRoute;
  products = signal({});

  resourceProducts = rxResource({
    params: () => ({
      products: this.products(),
      page: this.route() - 1,
    }),
    stream: ({ params }) => {
      if (!params.products) return of();

      return this.productsService.getAllProducts({ offset: params.page * 9 });
    },
  });
}
