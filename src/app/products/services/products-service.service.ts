import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Products } from '@products/interfaces/getall-products.interface';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsServiceService {
  http = inject(HttpClient);
  urlApi = environment.url_api;

  getAllProducts() {
    return this.http.get<Products>(`${this.urlApi}/products`).pipe(
      map((response) => {
        console.log('Products fetched:', response);
      })
    );
  }
}
