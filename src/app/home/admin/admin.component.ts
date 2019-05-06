import { Component, OnDestroy, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';

import { SubjectStoreService } from '../../services/subject-store.service';
import { GradeStoreService } from '../../services/grade-store.service';
import { LoginService } from '../../login/login-form/login.service';
import { UserLoggedService } from '../../services/user-logged.service';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class AdminComponent implements OnInit, OnDestroy {
    constructor(
        private courseStoreService: CourseStoreService, private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService, private userLoggedService: UserLoggedService,
        private gradeStoreService: GradeStoreService
    ) { }

    ngOnInit(): void {
        console.log("AdminComponent ngOnInit() called!!!");

        this.userStoreService.loadAllManagers();
        this.userStoreService.loadAllTeachers();

        if (this.userLoggedService.isManager()) {

            this.userStoreService.loadAllStudents();

            this.courseStoreService.loadAllCourses('2018');

            this.subjectStoreService.loadAllSubjects();

            this.gradeStoreService.loadAllGrades();
        }

    }

    ngOnDestroy() {
        console.log("AdminComponent ngOnDestroy() called!!!");
    }
}