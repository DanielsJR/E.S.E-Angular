import { User } from "./user";
import { Subject } from "./subject";
import { CorrespondItem, IncompleteTextItem, TrueFalseItem, MultipleSeletionItem } from "./quiz";


export class QuizStudent {
    constructor(
        public id?: string,

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

