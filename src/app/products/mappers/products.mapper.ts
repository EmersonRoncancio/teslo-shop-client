import {
  Product,
  Products,
} from '@products/interfaces/getall-products.interface';
import { ProductsMapperInterface } from '@products/interfaces/products-mapper.interface';

export class ProductsMapper {
  static mapProducts(products: Products): ProductsMapperInterface[] {
    return products.products.map((product: Product) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        stock: product.stock,
        sizes: product.sizes,
        gender: product.gender,
        images: product.images,
      };
    });
  }
}
