import { User } from "./user";

export class Attendance {
    constructor(
        public id?: string,
        public subjectId?: string,
        //public students?: StudentAtendance[],
        public students?: User[],
        public date?: string,

        public createdBy?: string,
        public createdDate?: string,
        public lastModifiedUser?: string,
        public lastModifiedDate?: string,

    ) { }
}

export class StudentAtendance {
    constructor(
        public id?: string,
        public didAttend?: boolean,
    ) { }
}