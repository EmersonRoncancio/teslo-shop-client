import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = input<number>();
  totalPages = input.required<number>();

  getPages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });
}
