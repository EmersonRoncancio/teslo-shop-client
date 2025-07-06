import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsServiceService } from '@products/services/products-service.service';
import { catchError, map, of } from 'rxjs';
import { ProductDetailsComponent } from './product-details/product-details.component';

@Component({
  selector: 'app-product-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productsService = inject(ProductsServiceService);
  router = inject(Router);
  idProduct = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['id']) || '')
  );

  resourceProduct = rxResource({
    params: () => ({ idProduct: this.idProduct() }),
    stream: ({ params }) => {
      if (!params.idProduct) return of();

      return this.productsService.getProductById(params.idProduct).pipe(
        catchError(() => {
          this.router.navigate(['/admin/products']);
          return of(null);
        })
      );
    },
  });
}
