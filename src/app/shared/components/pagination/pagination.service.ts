import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  activateRoute = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      map((param) => (isNaN(param) ? 1 : param))
    ),
    { initialValue: 1 }
  );

  getPagination() {
    return this.activateRoute();
  }
}
