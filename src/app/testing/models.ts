import { User } from "../models/user";
import { Course } from "../models/course";
import { Subject } from "../models/subject";
import { ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER, ROLE_ADMIN } from "../app.config";
import { Grade } from "../models/grade";
import { Theme } from "../shared/theme-picker/theme";




export const adminTest: User = {
    id: 'a01',
    username: '111',
    roles: [ROLE_ADMIN]
};

export const managerTest: User = {
    id: 'm01',
    username: 'manager01',
    roles: [ROLE_MANAGER]
};

export const managerTest2: User = {
    id: 'm02',
    username: 'manager02',
    roles: [ROLE_MANAGER]
};

export const studentTest: User = {
    id: 's01',
    username: 'student01',
    roles: [ROLE_STUDENT]
};

export const studentTest2: User = {
    id: 's02',
    username: 'student02',
    roles: [ROLE_STUDENT]
};

export const studentTest3: User = {
    id: 's03',
    username: 'student03',
    roles: [ROLE_STUDENT]
};

export const studentTest4: User = {
    id: 's04',
    username: 'student04',
    roles: [ROLE_STUDENT]
};

export const teacherTest: User = {
    id: 't01',
    username: 'teacher01',
    roles: [ROLE_TEACHER]
};

export const teacherTest2: User = {
    id: 't02',
    username: 'teacher02',
    roles: [ROLE_TEACHER]
};

export const courseTest: Course = {
    id: 'c01',
    name: '1A',
    chiefTeacher: teacherTest,
    students: [studentTest, studentTest2],
    year: '2019'
}

export const courseTest2: Course = {
    id: 'c02',
    name: '1B',
    chiefTeacher: teacherTest2,
    students: [studentTest3, studentTest4],
    year: '2019'
}

export const subjectTest: Subject = {
    id: 's01',
    name: 'MATEMATICAS',
    teacher: teacherTest,
    course: courseTest,
}

export const subjectTest2: Subject = {
    id: 's02',
    name: 'HISTORIA',
    teacher: teacherTest2,
    course: courseTest2,
}

export const gradeTest: Grade = {
    id: 'g01',
    subject: subjectTest,
    student: studentTest,
    grade: 7.0,
    type: 'examen',
    title: 'examen01',
    date: '28/03/2019',
}

export const gradeTest2: Grade = {
    id: 'g02',
    subject: subjectTest2,
    student: studentTest2,
    grade: 4.0,
    type: 'examen',
    title: 'examen01',
    date: '20/05/2019',
}

export const themeLightTest: Theme = {
    name: 'red-indigo',
    color: '#F44336',
    isDark: false
}

export const themeDarkTest: Theme = {
    name: 'red-indigo-dark',
    color: '#F44336',
    isDark: true
}

