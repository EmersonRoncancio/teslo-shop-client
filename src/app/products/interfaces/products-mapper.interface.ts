export interface ProductsMapperInterface {
  id: string;
  title: string;
  price: number;
  description: string;
  stock: number;
  sizes: string[];
  gender: string;
  images: string[];
  tags: string[];
  slug: string;
}

export interface ProductsMapperType {
  page: number;
  totalPages: number;
  products: ProductsMapperInterface[];
}
