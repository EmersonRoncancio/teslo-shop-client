import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { ImagesPipe } from '@products/pipes/images.pipe';
import { ProductsServiceService } from '@products/services/products-service.service';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-carousel',
  imports: [ImagesPipe],
  templateUrl: './carousel.component.html',
  styles: `
    .swiper {
      width: 100%;
      height: 500px;
    }
  `,
})
export class CarouselComponent implements AfterViewInit, OnChanges {
  productService = inject(ProductsServiceService);
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  images = input.required<string[]>();
  swiper: Swiper | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) {
      return;
    }

    if (!this.swiper) return;

    this.swiper.destroy(true, true);

    const element =
      this.swiperDiv().nativeElement.querySelector('.swiper-pagination');

    element.innerHTML = '';

    setTimeout(() => {
      this.swiperInit();
    }, 100);
  }

  swiperInit() {
    const element = this.swiperDiv().nativeElement;
    if (!element) {
      console.error('Swiper element not found');
      return;
    }
    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

  ngAfterViewInit() {
    this.swiperInit();
  }
}
