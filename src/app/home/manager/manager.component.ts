import { Component, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { LoginService } from '../../login/login.service';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class ManagerComponent implements OnInit {

    constructor(
        private courseStoreService: CourseStoreService,
        private userStoreService: UserStoreService,
        private loginService: LoginService
    ) { }

    ngOnInit(): void {
        if (this.loginService.isAdmin()) {
            this.userStoreService.loadInitialDataManagers();
        }
        this.userStoreService.loadInitialDataTeachers();
        this.userStoreService.loadInitialDataStudents();

        this.courseStoreService.getCourses(2018);
    }
}