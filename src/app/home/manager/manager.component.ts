import { Component, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';

@Component({
    selector: 'nx-manager',
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        margin-bottom: 64px;
      }
    `],
})

export class ManagerComponent implements OnInit {

    constructor(
        private courseStoreService: CourseStoreService,
        private subjectStoreService: SubjectStoreService,
        private userStoreService: UserStoreService,
        private userLoggedService: UserLoggedService,

    ) { }

    ngOnInit(): void {
        if (this.userLoggedService.isAdmin()) {
            this.userStoreService.loadAllManagers();
        }
        this.userStoreService.loadAllTeachers();
        this.userStoreService.loadAllStudents();

        this.courseStoreService.loadCoursesByYear('2018');

        this.subjectStoreService.loadSubjectsByYear('2018');

    }

}