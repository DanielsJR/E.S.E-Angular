import { Component, OnDestroy, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { LoginService } from '../../login/login.service';
import { SubjectStoreService } from '../../services/subject-store.service';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class AdminComponent implements OnInit, OnDestroy {
    constructor(
        private courseStoreService: CourseStoreService, private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService, private loginService: LoginService
    ) { }

    ngOnInit(): void {
        console.log("AdminComponent ngOnInit() called!!!");

        this.userStoreService.loadAllManagers();
        this.userStoreService.loadAllTeachers();

        if (this.loginService.isManager()) {
            this.userStoreService.loadAllStudents();
            this.courseStoreService.loadAllCourses(2018);
            this.subjectStoreService.loadAllSubjects();
        }

    }

    ngOnDestroy() {
        console.log("AdminComponent ngOnDestroy() called!!!");
    }
}