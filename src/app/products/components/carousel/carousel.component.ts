import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
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
export class CarouselComponent implements AfterViewInit {
  productService = inject(ProductsServiceService);
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  images = input.required<string[]>();

  ngAfterViewInit() {
    const element = this.swiperDiv().nativeElement;
    if (!element) {
      console.error('Swiper element not found');
      return;
    }
    const swiper = new Swiper(element, {
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
}
