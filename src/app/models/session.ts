import { ROLE_ADMIN, ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER } from '../app.config';

export class Session {
    constructor(public token: string, public role: string) {
    }

    hasPrivileges(): boolean {
        return this.role === ROLE_ADMIN || this.role === ROLE_MANAGER || this.role === ROLE_TEACHER || this.role === ROLE_STUDENT;
    }
}
