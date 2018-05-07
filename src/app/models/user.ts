
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
        public avatar?: any,
        public mobile?: number,
        public email?: string,
        public address?: string,
        public commune?: string,
        public roles?: string[],
        public token?: string,
        public active?: boolean

    ) { }


    equals(user: User): boolean {
        return ((user.username === this.username) && (user.mobile === this.mobile) && (user.dni === this.dni) && (user.email === this.email));
    }

    shortName(): string {
        const n1 = this.firstName.substr(0, this.firstName.indexOf(' ')) || this.firstName; 
        const n2 = this.lastName.substr(0, this.lastName.indexOf(' ')) || this.lastName; 
            return n1 + ' ' + n2;
      }

}
