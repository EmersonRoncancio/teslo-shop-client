import { Component, inject, signal } from '@angular/core';
import { ProductsServiceService } from '@products/services/products-service.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsServiceService);
  products = signal([]);

  resources = rxResource({
    params: () => ({ products: this.products() }),
    stream: ({ params }) => {
      if (!params.products) return of();

      return this.productsService.getAllProducts();
    },
  });
}
