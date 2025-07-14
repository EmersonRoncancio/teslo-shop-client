import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'images',
})
export class ImagesPipe implements PipeTransform {
  urlApi = environment.url_api;

  transform(images: string | string[] | null): any {
    console.log('ImagesPipe called with:', images);
    if (images === null) {
      return './assets/images/not-image.png';
    }

    if (typeof images === 'string' && images.startsWith('blob:')) {
      console.warn('Image URL is already a full URL:', images);
      return images;
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
