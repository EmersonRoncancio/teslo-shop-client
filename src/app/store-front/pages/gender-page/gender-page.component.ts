import { Component, inject } from '@angular/core';
import { CardProductComponent } from '../../components/card-product/card-product.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of, tap } from 'rxjs';
import { ProductsServiceService } from '@products/services/products-service.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-gender-page',
  imports: [CardProductComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  productsService = inject(ProductsServiceService);
  gender = toSignal(
    inject(ActivatedRoute).params.pipe(map((param) => param['gender'] || ''))
  );

  resourceProducts = rxResource({
    params: () => ({ gender: this.gender() }),
    stream: ({ params }) => {
      if (!params.gender) return of();

      return this.productsService.getAllProducts({ gender: params.gender });
    },
  });
}
