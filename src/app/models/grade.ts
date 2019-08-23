import { User } from "./user";
import { Evaluation } from "./evaluation";
import { QuizStudent } from "./quiz-student";

export class Grade {
    constructor(
        public id?: string,
        public student?: User,
        public grade?: number,

        public evaluation?: Evaluation,
        public quizStudent?: QuizStudent,
       
        public createdBy?:string,
        public createdDate?:string,
        public lastModifiedUser?:string,
        public lastModifiedDate?:string,
    ) { }
}