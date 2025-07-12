import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'images',
})
export class ImagesPipe implements PipeTransform {
  urlApi = environment.url_api;

  transform(images: string | string[] | null): any {
    if (images === null) {
      return './assets/images/not-image.png';
    }

    if (!images || images.length === 0) {
      return './assets/images/not-image.png';
    }

    if (typeof images === 'string') {
      return `${this.urlApi}/files/product/${images}`;
    }

    return images.map((image) => `${this.urlApi}/files/product/${image}`);
  }
}
