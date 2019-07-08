import { User } from "../models/user";
import { Course } from "../models/course";
import { Subject } from "../models/subject";
import { ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER, ROLE_ADMIN } from "../app.config";
import { Grade } from "../models/grade";
import { Theme } from "../shared/theme-picker/theme";
import { HttpErrorResponse } from "@angular/common/http";
import { Quiz } from "../models/quiz";




export const adminTest: User = {
    id: 'a01',
    username: '111',
    firstName: '111_firstName',
    lastName: '111_lastName',
    roles: [ROLE_ADMIN]
};

export const managerTest: User = {
    id: 'm01',
    username: 'manager01',
    firstName: 'm01_firstName',
    lastName: 'm01_lastName',
    roles: [ROLE_MANAGER]
};

export const managerTest2: User = {
    id: 'm02',
    username: 'manager02',
    firstName: 'm02_firstName',
    lastName: 'm02_lastName',
    roles: [ROLE_MANAGER]
};


export const teacherTest: User = {
    id: 't01',
    username: 'teacher01',
    firstName: 't01_firstName',
    lastName: 't01_lastName',
    roles: [ROLE_TEACHER]
};

export const teacherTest2: User = {
    id: 't02',
    username: 'teacher02',
    firstName: 't02_firstName',
    lastName: 't02_lastName',
    roles: [ROLE_TEACHER]
};

export const studentTest: User = {
    id: 's01',
    username: 'student01',
    firstName: 's01_firstName',
    lastName: 's01_lastName',
    roles: [ROLE_STUDENT]
};

export const studentTest2: User = {
    id: 's02',
    username: 'student02',
    firstName: 's02_firstName',
    lastName: 's02_lastName',
    roles: [ROLE_STUDENT]
};

export const studentTest3: User = {
    id: 's03',
    username: 'student03',
    firstName: 's03_firstName',
    lastName: 's03_lastName',
    roles: [ROLE_STUDENT]
};

export const studentTest4: User = {
    id: 's04',
    username: 'student04',
    firstName: 's04_firstName',
    lastName: 's04_lastName',
    roles: [ROLE_STUDENT]
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

export const quizTest: Quiz = {
    id: 'q01',
    title: 'quiz-01',
    author: teacherTest,
    subjectName: subjectTest.name,
    quizLevel: 'Primero Básico'
}

export const quizTest2: Quiz = {
    id: 'q02',
    title: 'quiz-02',
    author: teacherTest2,
    subjectName: subjectTest2.name,
    quizLevel: 'Primero Básico'
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





export const httpError400 = new HttpErrorResponse({
    error: 'test 400 error',
    status: 400,
    statusText: 'Bad Request'
});

export const httpError401 = new HttpErrorResponse({
    error: 'test 401 error',
    status: 401,
    statusText: 'Unauthorized'
});

export const httpError403 = new HttpErrorResponse({
    error: 'test 403 error',
    status: 403,
    statusText: 'Forbidden'
});

export const httpError404 = new HttpErrorResponse({
    error: 'test 404 error',
    status: 404,
    statusText: 'Not Found'
});

export const httpError500 = new HttpErrorResponse({
    error: 'test 500 error',
    status: 500,
    statusText: 'Internal Server Error'
});

export const simpleError = new Error('ups!');

