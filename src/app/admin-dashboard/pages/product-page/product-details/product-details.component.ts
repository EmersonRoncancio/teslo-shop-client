import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarouselComponent } from '@products/components/carousel/carousel.component';
import { Product } from '@products/interfaces/getall-products.interface';
import { ProductsMapperInterface } from '@products/interfaces/products-mapper.interface';
import { ProductsMapper } from '@products/mappers/products.mapper';
import { FormUtils } from '@utils/form.utils';
import { ErrorMessageComponent } from 'src/app/admin-dashboard/components/error-message/error-message.component';

@Component({
  selector: 'product-details',
  imports: [CarouselComponent, ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<ProductsMapperInterface>();
  fb = inject(FormBuilder);
  formUtils = FormUtils;

  productForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: ['', [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    slug: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(FormUtils.slugPattern),
      ],
    ],
    stock: ['', [Validators.required, Validators.min(0)]],
    sizes: [[''], [Validators.required]],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|unisex|kid/)],
    ],
    tags: ['', [Validators.required]],
  });
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  onSubumit() {
    console.log('Formulario enviado', this.productForm.value);
  }

  setFormValues(product: Partial<ProductsMapperInterface>) {
    this.productForm.reset(product as any);
    this.productForm.patchValue({
      tags: product.tags?.join(',')!,
    });
  }

  ngOnInit() {
    console.log('product', this.product().tags);
    this.setFormValues(this.product());
  }

  onChangeSize(size: string) {
    const sizes = this.productForm.get('sizes')?.value || [];
    console.log('sizes', sizes);
    if (sizes.includes(size)) {
      this.productForm.patchValue({
        sizes: sizes.filter((s: string) => s !== size),
      });
    } else {
      this.productForm.patchValue({
        sizes: [...sizes, size],
      });
    }
  }
}
