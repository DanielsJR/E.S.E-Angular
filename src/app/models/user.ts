export const MOBILE_ATTRIBUTE_NAME = 'mobile';
export const DNI_ATTRIBUTE_NAME = 'dni';
export const EMAIL_ATTRIBUTE_NAME = 'email';
export const ID_ATTRIBUTE_NAME = 'id';
export const USERNAME_ATTRIBUTE_NAME = 'userName';

export class User {
    constructor(
         public id?: number,
         public userName?: string,
         public firstName?: string,
         public lastName?: string,
         public dni?: string,
         public age?: number,
         public gender?:string,
         public password?: string,
         public mobile?: number,
         public email?: string,
         public address?: string,
         public active?: boolean,
         public roles?: string[]
         ) {
    }


    equals(user: User): boolean {
        return ((user.mobile === this.mobile) && (user.password === this.password) && (user.dni === this.dni)
            && (user.email === this.email) && (user.userName === this.userName) && (user.address === this.address)
            && (user.active === this.active));
    }
}
