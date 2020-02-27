import { User } from "./user";
import { Course } from "./course";

export class Subject {
    constructor(
        public id?: string,
        public name?: string,
        public teacher?: User,
        public course?: Course,

        public createdBy?:string,
        public createdDate?:string,
        public lastModifiedUser?:string,
        public lastModifiedDate?:string,
    ) { }
}