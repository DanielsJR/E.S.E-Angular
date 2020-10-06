import { Pipe, PipeTransform } from '@angular/core';
import { ROLE_ADMIN, ROLE_ADMIN_SPANISH, ROLE_MANAGER, ROLE_MANAGER_SPANISH, ROLE_TEACHER, ROLE_TEACHER_SPANISH, ROLE_STUDENT, ROLE_STUDENT_SPANISH } from '../../app.config';
/*
 * Example:
 *   {{ user.roles | rolesToSpanish }}
 *   formats from: MANAGER,TEACHER to: Administrador, Docente
*/
@Pipe({ name: 'rolesToSpanish' })
export class RolesToSpanishPipe implements PipeTransform {
    transform(roles: string[]): string {
        let rolesSpanish: string[] = [];
        for (let role of roles) {
            if (role === ROLE_ADMIN) role = ROLE_ADMIN_SPANISH;
            else if (role === ROLE_MANAGER) role = ROLE_MANAGER_SPANISH;
            else if (role === ROLE_TEACHER) role = ROLE_TEACHER_SPANISH;
            else if (role === ROLE_STUDENT) role = ROLE_STUDENT_SPANISH;

            rolesSpanish.push(role);
        }
        return rolesSpanish.toString().replace(/,/g, '-');
    }
}