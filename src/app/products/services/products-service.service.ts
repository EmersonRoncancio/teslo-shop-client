import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  Product,
  Products,
} from '@products/interfaces/getall-products.interface';
import { ProductsMapper } from '@products/mappers/products.mapper';
import { map, tap, of } from 'rxjs';
import { environment } from 'src/environments/environment';

type Gender = 'men' | 'women' | 'unisex' | 'kid' | '';

interface Options {
  limit?: number;
  offset?: number;
  gender?: Gender;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsServiceService {
  http = inject(HttpClient);
  urlApi = environment.url_api;
  activateRoute = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      map((param) => (isNaN(param) ? 1 : param))
    ),
    { initialValue: 1 }
  );

  getPagination() {}

  getAllProducts({ limit = 9, offset = 1, gender = '' }: Options = {}) {
    return this.http
      .get<Products>(`${this.urlApi}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(
        map((response) => {
          return ProductsMapper.mapProducts(response);
        })
      );
  }

  getImageProduct(image: string) {
    const imageUrl = `${this.urlApi}/files/product/${image}`;

    return of(imageUrl);
  }

  getProductById(productId: string) {
    return this.http.get<Product>(`${this.urlApi}/products/${productId}`).pipe(
      map((response) => {
        return ProductsMapper.mapProduct(response);
      })
    );
  }
}
