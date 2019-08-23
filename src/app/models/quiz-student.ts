import { User } from "./user";
import { Subject } from "./subject";


export class QuizStudent {
    constructor(
        public id?: string,
        public student?: User,
        public grade?: string,
        public subject?: Subject,
        public date?: string,

        public correspondItemAnswers?: string[],
        public trueFalseItemAnswers?: boolean[],
        public multipleSelectionItemAnswers?: string[],
        public incompleteTextItemAnswers?: string[],
   
        public createdBy?: string,
        public createdDate?: string,
        public lastModifiedUser?: string,
        public lastModifiedDate?: string,
    ) { }
}

