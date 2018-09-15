import { Component, OnDestroy, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { LoginService } from '../../login/login.service';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class AdminComponent implements OnInit, OnDestroy {
    constructor(
        private courseStoreService: CourseStoreService,
        private userStoreService: UserStoreService,
        private loginService: LoginService
    ) { }

    ngOnInit(): void {
        this.userStoreService.loadInitialDataManagers();
        this.userStoreService.loadInitialDataTeachers();



        //this.userStoreService.loadInitialDataStudents();
        //this.courseStoreService.getCourses(2018);
    }

    ngOnDestroy() {
        console.log("AdminComponent ngOnDestroy called!!!");
    }
}