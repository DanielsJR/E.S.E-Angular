import { User } from "./user";
import { Grade } from "./grade";

export class StudentGrades {
    constructor(
        public student?: User,
        public grades?: Grade[],
    ) { }
}