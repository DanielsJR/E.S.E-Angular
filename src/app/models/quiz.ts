import { User } from "./user";


export class Quiz {
    constructor(
        public id?: string,
        public title?: string,
        public description?: string,
        public author?: User,
        public date?: string,
        public subjectName?: string,
        public degrade?: string,
        public correspondItems?: string[],
        public incompleteTextItems?: string[],
        public trueFalseItems?: string[],
        public multipleSelectionItems?: string[],

        public createdBy?: string,
        public createdDate?: string,
        public lastModifiedUser?: string,
        public lastModifiedDate?: string,
    ) { }
}