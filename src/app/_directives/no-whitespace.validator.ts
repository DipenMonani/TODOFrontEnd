import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

export function NoWhitespaceValidator(control: FormControl): { whitespace: boolean } {

    if (control && control.value) {
        let isWhitespace = (control.value || '').trim().length === 0;
        let isValid = !isWhitespace;
        console.log(isValid);
        return isValid ? null : { 'whitespace': true };
    }
}