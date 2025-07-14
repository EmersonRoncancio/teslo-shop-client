import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarouselComponent } from '@products/components/carousel/carousel.component';
import { Product } from '@products/interfaces/getall-products.interface';
import { ProductsMapperInterface } from '@products/interfaces/products-mapper.interface';
import { ProductsMapper } from '@products/mappers/products.mapper';
import { ProductsServiceService } from '@products/services/products-service.service';
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
  productService = inject(ProductsServiceService);
  hasSuccess = signal(false);
  hasError = signal(false);
  router = inject(Router);
  viewImages = signal<string[]>([]);
  images = computed(() => {
    return [...this.product().images, ...this.viewImages()];
  });
  filesImages: FileList | null = null;

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
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: Partial<ProductsMapperInterface> = {
      title: this.productForm.value.title!,
      price: +this.productForm.value.price!,
      description: this.productForm.value.description!,
      slug: this.productForm.value.slug!,
      stock: +this.productForm.value.stock!,
      sizes: this.productForm.value.sizes || [],
      gender: this.productForm.value.gender!,
      images: this.product().images || [],
      tags:
        this.productForm.value.tags
          ?.toLocaleLowerCase()
          ?.split(',')
          .map((tag: string) => tag.trim()) || [],
    };

    if (this.product().id === 'new') {
      this.productService.createProduct(productData).subscribe({
        next: (responseData) => {
          console.log('Product created successfully:', responseData);
          this.hasSuccess.set(true);
          setTimeout(() => {
            this.hasSuccess.set(false);
            this.router.navigate(['/admin/products', responseData?.id]);
          }, 3000);
        },
        error: (error) => {
          this.hasError.set(true);
          setTimeout(() => {
            this.hasError.set(false);
          }, 3000);
        },
      });

      return;
    }

    this.productService
      .upadateProduct(this.product().id, productData)
      .subscribe({
        next: (responseData) => {
          this.hasSuccess.set(true);
          setTimeout(() => {
            this.hasSuccess.set(false);
          }, 3000);
        },
        error: (error) => {
          this.hasError.set(true);
          setTimeout(() => {
            this.hasError.set(false);
          }, 3000);
        },
      });
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filesImages = input.files;
      const files = Array.from(input.files);
      const images: string[] = files.map((file) => URL.createObjectURL(file));
      this.viewImages.set(images);
    }
  }
}
