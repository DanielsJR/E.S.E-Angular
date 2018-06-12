import { FormControl } from "@angular/forms";


export function rutValidator(control: FormControl) {
    let isRutValid = true;
    if (control.value) {
        isRutValid = (/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(control.value));

        if (isRutValid) {
            let tmp = control.value.split('-');
            let rut = tmp[0];
            let digv = tmp[1];
            if (digv == 'K') digv = 'k';

            let M = 0;
            let S = 1;
            for (; rut; rut = Math.floor(rut / 10))
                S = (S + rut % 10 * (9 - M++ % 6)) % 11;
            let result = S ? S - 1 : 'k';
            isRutValid = (result == digv);
        }

    }
    let isValid = isRutValid;
    return isValid ? null : { 'checkrut': true }
}