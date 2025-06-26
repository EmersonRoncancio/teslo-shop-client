import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'lengthDescription',
})
export class LengthDescriptionPipe implements PipeTransform {
  transform(value: unknown): string {
    if (typeof value !== 'string') {
      return '';
    }

    // console.log(value.length);

    const lenghvalue = value.length;
    if (lenghvalue < 70) {
      return value;
    } else {
      return value.slice(0, 70) + '...';
    }
  }
}
