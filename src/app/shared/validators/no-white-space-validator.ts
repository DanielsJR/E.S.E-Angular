import { FormControl } from "@angular/forms";


export function noWhitespaceValidator(control: FormControl) {
    let isWhitespace = false;
    if (control.value) {
        isWhitespace = (control.value.trim().length === 0);
    }
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
}