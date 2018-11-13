import { User } from "./user";
import { Subject } from "./subject";

export class Grade {
    constructor(
        public id?: string,
        public subject?: Subject,
        public student?: User,
        public grade?: string,
        public title?: string,
        public date?: string,
    ) { }
}