import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateValidator(form: FormGroup, limit: string, isMin = true): ValidatorFn {
  return (control): ValidationErrors | null => {
    const value = control.value;

    if (isMin) {
      const maxDate = Date.parse(form.controls['maxDate'].value);
      const currentDate = Date.parse(value);
      const limitDate = Date.parse(limit);

      if (currentDate >= limitDate && currentDate < maxDate) {
        return null;
      }
    } else {
      const minDate = Date.parse(form.controls['minDate'].value);
      const currentDate = Date.parse(value);
      const limitDate = Date.parse(limit);

      if (currentDate <= limitDate && currentDate > minDate) {
        return null;
      }
    }
    return { error: 'Invalid date' };
  };
}
