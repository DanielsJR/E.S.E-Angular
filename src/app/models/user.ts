export const MOBILE_ATTRIBUTE_NAME = 'mobile';
export const DNI_ATTRIBUTE_NAME = 'dni';
export const EMAIL_ATTRIBUTE_NAME = 'email';
export const ID_ATTRIBUTE_NAME = 'id';
export const USERNAME_ATTRIBUTE_NAME = 'username';

export class User {
    constructor(
         public id?: string,
         public username?: string,
         public password?: string,
         public firstName?: string,
         public lastName?: string,
         public dni?: string,
         public birthday?: number,
         public gender?:string,
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
}
