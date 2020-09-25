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

    date: Date;

    constructor(
        private subjectStoreService: SubjectStoreService,
        private userStoreService: UserStoreService,

    ) {
        this.date = new Date();
    }

    ngOnInit(): void {
        this.userStoreService.loadAllTeachers();
        this.userStoreService.loadAllStudents();

        this.subjectStoreService.loadSubjectsByYear('2018');
    }

}