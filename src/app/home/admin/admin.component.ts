import { Component, OnDestroy, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStore2Service } from '../../services/user-store2.service';
import { LoginService } from '../../login/login.service';

@Component({
    template: `<router-outlet></router-outlet>`
})
export class AdminComponent implements OnInit, OnDestroy {
    constructor(
        private courseStoreService: CourseStoreService,
        private userStoreService2: UserStore2Service,
        private loginService: LoginService
    ) { }

    ngOnInit(): void {
        this.userStoreService2.loadInitialDataManagers();
        this.userStoreService2.loadInitialDataTeachers();



        //this.userStoreService2.loadInitialDataStudents();
        //this.courseStoreService.getCourses(2018);
    }

    ngOnDestroy() {
        console.log("AdminComponent ngOnDestroy called!!!");
    }
}