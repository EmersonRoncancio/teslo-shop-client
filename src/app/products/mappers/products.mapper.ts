import {
  Product,
  Products,
} from '@products/interfaces/getall-products.interface';
import {
  ProductsMapperInterface,
  ProductsMapperType,
} from '@products/interfaces/products-mapper.interface';

export class ProductsMapper {
  static mapProducts(products: Products): ProductsMapperType {
    return {
      page: products.pages,
      totalPages: products.count,
      products: products.products.map((product) =>
        ProductsMapper.mapProduct(product)
      ),
    };
  }

  static mapProduct(product: Product): ProductsMapperInterface {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      stock: product.stock,
      sizes: product.sizes,
      gender: product.gender,
      images: product.images,
      tags: product.tags,
      slug: product.slug,
    };
  }
}
