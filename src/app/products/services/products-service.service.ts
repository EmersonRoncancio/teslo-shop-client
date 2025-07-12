import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  Gender,
  Product,
  Products,
} from '@products/interfaces/getall-products.interface';
import {
  ProductsMapperInterface,
  ProductsMapperType,
} from '@products/interfaces/products-mapper.interface';
import { ProductsMapper } from '@products/mappers/products.mapper';
import { map, tap, of, Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

type GenderType = 'men' | 'women' | 'unisex' | 'kid' | '';

interface Options {
  limit?: number;
  offset?: number;
  gender?: GenderType;
}

const initialProducts: ProductsMapperInterface = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  images: [],
  tags: [],
  slug: '',
};

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
    if (productId === 'new') {
      return of(initialProducts);
    }

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

  upadateProduct(idProduct: string, product: Partial<ProductsMapperInterface>) {
    return this.http
      .patch(`${this.urlApi}/products/${idProduct}`, {
        ...product,
      })
      .pipe(
        map((response) => {
          console.log('response', response);
          const updatedProduct = ProductsMapper.mapProduct(response as Product);
          this.productCache.set(idProduct, updatedProduct);
          return updatedProduct;
        }),
        tap((updatedProduct) => {
          this.updateProductCache(idProduct, updatedProduct);
        }),
        catchError(() => {
          console.error('Error updating product');
          return of(null); // Return null or handle the error as needed
        })
      );
  }

  updateProductCache(idProduct: string, product: ProductsMapperInterface) {
    this.productCache.set(idProduct, product);

    this.productsCache.forEach((response) => {
      response.products = response.products.map((p) => {
        if (p.id === idProduct) {
          return product;
        }
        return p;
      });
    });
  }

  createProduct(product: Partial<ProductsMapperInterface>) {
    return this.http.post<Product>(`${this.urlApi}/products`, product).pipe(
      map((response) => {
        console.log('response', response);
        const newProduct = ProductsMapper.mapProduct(response);
        this.productCache.set(newProduct.id, newProduct);
        this.updateProductCache(newProduct.id, newProduct);
        return newProduct;
      }),
      catchError(() => {
        console.error('Error creating product');
        return of(null); // Return null or handle the error as needed
      })
    );
  }
}
