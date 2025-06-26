import { Component, inject, signal } from '@angular/core';
import { ProductsServiceService } from '@products/services/products-service.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { CardProductComponent } from '../../components/card-product/card-product.component';

@Component({
  selector: 'app-home-page',
  imports: [CardProductComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsServiceService);
  products = signal([]);

  resourceProducts = rxResource({
    params: () => ({ products: this.products() }),
    stream: ({ params }) => {
      if (!params.products) return of();

      return this.productsService.getAllProducts().pipe(tap((products) => {}));
    },
  });
}
