import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductsMapperInterface } from '@products/interfaces/products-mapper.interface';
import { LengthDescriptionPipe } from '@products/pipes/length-description.pipe';
import { ProductsServiceService } from '@products/services/products-service.service';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-card-product',
  imports: [RouterLink, LengthDescriptionPipe],
  templateUrl: './card-product.component.html',
})
export class CardProductComponent {
  productService = inject(ProductsServiceService);

  product = input.required<ProductsMapperInterface>();
  image = `${environment.url_api}/files/product/1657932-00-A_0_2000.jpg`;

  resourceImage = rxResource({
    params: () => ({ productImages: this.product().images }),
    stream: ({ params }) => {
      if (!params.productImages || params.productImages.length === 0)
        return of(
          'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
        );

      return this.productService.getImageProduct(params.productImages[0]);
    },
  });
}
