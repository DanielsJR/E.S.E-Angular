import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';

@Component({
    template: `<router-outlet></router-outlet>`
})

export class ManagerComponent implements OnInit, OnDestroy {

    constructor(private courseStoreService: CourseStoreService, private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService, private userLoggedService: UserLoggedService
    ) { }

    ngOnInit(): void {
        console.log("ManagerComponent ngOnInit() called!!!");

        if (this.userLoggedService.isAdmin()) {
            this.userStoreService.loadAllManagers();
        }
        this.userStoreService.loadAllTeachers();
        this.userStoreService.loadAllStudents();

        this.courseStoreService.loadAllCourses('2018');

        this.subjectStoreService.loadSubjects();

    }

    ngOnDestroy() {
        console.log("ManagerComponent ngOnDestroy() called!!!");
    }
}