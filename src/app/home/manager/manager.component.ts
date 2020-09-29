import { Component, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { MultiDatePickerService } from '../../shared/multi-date-picker/multy-date-picker.service';


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

    year: Date;

    constructor(
        private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService,
        private courseStoreService:CourseStoreService,
        private multiDatePickerService: MultiDatePickerService

    ) {

    }

    ngOnInit(): void {
        this.userStoreService.loadAllTeachers();
        this.userStoreService.loadAllStudents();

        this.multiDatePickerService.date$.subscribe(date => {
            this.year = date;
            this.courseStoreService.loadCoursesByYear(this.year.getFullYear().toString());
            this.subjectStoreService.clearStore();
            this.subjectStoreService.loadSubjectsByYear(this.year.getFullYear().toString());
        })
    }

}