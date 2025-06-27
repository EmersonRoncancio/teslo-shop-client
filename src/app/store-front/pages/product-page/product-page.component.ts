import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsServiceService } from '@products/services/products-service.service';
import { CardProductComponent } from '@sotore-front/components/card-product/card-product.component';
import { map, of, tap } from 'rxjs';
import { CarouselComponent } from '../../../products/components/carousel/carousel.component';

@Component({
  selector: 'app-product-page',
  imports: [CardProductComponent, CarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productsService = inject(ProductsServiceService);
  productId = toSignal(
    inject(ActivatedRoute).params.pipe(
      map((params) => params['productId'] || '')
    )
  );

  resourceProduct = rxResource({
    params: () => ({ productId: this.productId() }),
    stream: ({ params }) => {
      if (!params.productId) return of();

      return this.productsService.getProductById(params.productId).pipe(
        tap((product) => {
          console.log('Product loaded:', product);
        })
      );
    },
  });
}
