import { User } from "./user";

export class Course {
    constructor(
        public id?: string,
        public name?: string,
        public chiefTeacher?: User,
        public students?: User[],
        public year?: string,

    ) { }
}