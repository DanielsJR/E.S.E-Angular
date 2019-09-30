import { User } from "./user";


export class Quiz {
    constructor(
        public id?: string,
        public title?: string,
        public description?: string,
        public author?: User,
        public subjectName?: string,
        public quizLevel?: string,
        
        public correspondItems?: CorrespondItem[],
        public incompleteTextItems?: IncompleteTextItem[],
        public trueFalseItems?: TrueFalseItem[],
        public multipleSelectionItems?: MultipleSeletionItem[],

        public createdBy?: string,
        public createdDate?: string,
        public lastModifiedUser?: string,
        public lastModifiedDate?: string,
    ) { }
}

export class CorrespondItem {
    constructor(
        public item: string,
        public correspond: string,
    ) { }
}

export class TrueFalseItem {
    constructor(
        public sentence: string,
        public answer: boolean,
    ) { }
}

export class MultipleSeletionItem {
    constructor(
        public sentence: string,
        public alternativeA:string,
        public alternativeB:string,
        public alternativeC:string,
        public alternativeD:string,
        public answer: string,
    ) { }
}

export class IncompleteTextItem {
    constructor(
        public sentence: string,
        public answer: string,
    ) { }
}

export const QUIZ_LEVELS = [
    { value: 'PRIMERO_BASICO', viewValue: 'Primero Básico' },
    { value: 'SEGUNDO_BASICO', viewValue: 'Segundo Básico' },
    { value: 'TERCERO_BASICO', viewValue: 'Tercero Básico' },
    { value: 'CUARTO_BASICO', viewValue: 'Cuarto Básico' },
    { value: 'QUINTO_BASICO', viewValue: 'Quinto Básico' },
    { value: 'SEXTO_BASICO', viewValue: 'Sexto Básico' },
    { value: 'SEPTIMO_BASICO', viewValue: 'Septimo Básico' },
    { value: 'OCTAVO_BASICO', viewValue: 'Octavo Básico' },
];

export const TRUE_FALSES = [
    { value: true, viewValue: 'Verdadero' },
    { value: false, viewValue: 'Falso' },
];