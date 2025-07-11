import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/form.utils';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {
  control = input.required<AbstractControl>();
  formUtils = FormUtils;

  get errorMessage() {
    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0
      ? this.formUtils.getTextError(errors)
      : null;
  }
}
