import { Component, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { QuizStoreService } from '../../services/quiz-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { UserStoreService } from '../../services/user-store.service';
import { MultiDatePickerService } from '../../shared/multi-date-picker/multy-date-picker.service';


@Component({
    selector: 'nx-manager',
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        --margin-bottom: 64px;
      }
    `],
})

export class ManagerComponent implements OnInit {

    year: Date;
    usernameLogged: any;
    isTeacher: boolean;

    constructor(
        private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService,
        private courseStoreService: CourseStoreService,
        private multiDatePickerService: MultiDatePickerService,
        private userLoggedService: UserLoggedService,
        private quizStoreService: QuizStoreService,

    ) {
        this.usernameLogged = userLoggedService.getTokenUsername();
        this.isTeacher = userLoggedService.isTeacher();

    }

    ngOnInit(): void {
        this.userStoreService.loadAllTeachers();
        this.userStoreService.loadAllStudents();

        this.multiDatePickerService.date$.subscribe(date => {
            this.year = date;

            this.courseStoreService.clearStore();
            this.subjectStoreService.clearStore();
            this.courseStoreService.loadCoursesByYear(this.year.getFullYear().toString());
            this.subjectStoreService.loadSubjectsByYear(this.year.getFullYear().toString());
        })


        if (this.isTeacher) this.quizStoreService.getTeacherQuizes(this.usernameLogged);
    }

}