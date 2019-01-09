import { User } from "./user";
import { Subject } from "./subject";

export class Grade {
    constructor(
        public id?: string,
        public subject?: Subject,
        public student?: User,
        public grade?: number,
        public type?: string,
        public title?: string,
        public date?: string,
       
        public createdBy?:string,
        public createdDate?:string,
        public lastModifiedUser?:string,
        public lastModifiedDate?:string,
    ) { }
}