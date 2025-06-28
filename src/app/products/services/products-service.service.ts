import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  Product,
  Products,
} from '@products/interfaces/getall-products.interface';
import {
  ProductsMapperInterface,
  ProductsMapperType,
} from '@products/interfaces/products-mapper.interface';
import { ProductsMapper } from '@products/mappers/products.mapper';
import { map, tap, of, Observable } from 'rxjs';
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
  private productsCache: Map<string, ProductsMapperType> = new Map();
  private productCache: Map<string, ProductsMapperInterface> = new Map();

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

  getAllProducts({
    limit = 9,
    offset = 1,
    gender = '',
  }: Options = {}): Observable<ProductsMapperType> {
    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      const cacheProducts = this.productsCache.get(key) as ProductsMapperType;
      return of(cacheProducts);
    }

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
          console.log('response', response);
          const products = ProductsMapper.mapProducts(response);
          this.productsCache.set(key, products);

          return products;
        })
      );
  }

  getImageProduct(image: string) {
    const imageUrl = `${this.urlApi}/files/product/${image}`;

    return of(imageUrl);
  }

  getProductById(productId: string) {
    if (this.productCache.has(productId)) {
      const cachedProduct = this.productCache.get(
        productId
      ) as ProductsMapperInterface;
      return of(cachedProduct);
    }

    return this.http.get<Product>(`${this.urlApi}/products/${productId}`).pipe(
      tap((product) => {
        const productMap = ProductsMapper.mapProduct(product);
        this.productCache.set(productId, productMap);
      }),
      map((response) => {
        console.log('response', response);
        return ProductsMapper.mapProduct(response);
      })
    );
  }
}
