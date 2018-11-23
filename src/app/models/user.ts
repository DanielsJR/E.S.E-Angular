import { Avatar } from "./avatar";

export class User {
    constructor(
        public id?: string,
        public username?: string,
        public password?: string,
        public firstName?: string,
        public lastName?: string,
        public dni?: string,
        public birthday?: string,
        public gender?: string,
        public avatar?: Avatar,
        public mobile?: number,
        public email?: string,
        public address?: string,
        public commune?: string,
        public roles?: string[],
        public token?: string,
        public active?: boolean

    ) { }


}
