
export class Token {
    constructor(
        public token?: string,
        public tokenUserName?: string,
        public roles?:string[],
        public isExpired?: boolean,
        public expireDate?: any,

     ) { }
}