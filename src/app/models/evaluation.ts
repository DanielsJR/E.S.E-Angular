import { Subject } from "./subject";
import { Quiz } from "./quiz";

export class Evaluation {
    constructor(
        public id?: string,
        public type?: string,
        public title?: string,
        public subject?: Subject,
        public date?: string,
        public quiz?: Quiz,
        public isOpen?: boolean,
       
        public createdBy?:string,
        public createdDate?:string,
        public lastModifiedUser?:string,
        public lastModifiedDate?:string,
    ) { }
}