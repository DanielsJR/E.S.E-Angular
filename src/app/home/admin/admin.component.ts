import { Component, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';


@Component({
    selector: 'nx-admin',
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        margin-bottom: 64px;
      }
    `],
})
export class AdminComponent implements OnInit {
    constructor(
        private courseStoreService: CourseStoreService,
        private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService,
        private userLoggedService: UserLoggedService,
    ) { }

    ngOnInit(): void {
        this.userStoreService.loadAllManagers();
        this.userStoreService.loadAllTeachers();

        if (this.userLoggedService.isManager()) {
            this.userStoreService.loadAllStudents();
            this.courseStoreService.loadAllCourses('2018');
            this.subjectStoreService.loadSubjects();
        }

    }

}