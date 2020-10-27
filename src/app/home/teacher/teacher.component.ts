import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizStoreService } from '../../services/quiz-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { MultiDatePickerService } from '../../shared/multi-date-picker/multy-date-picker.service';


@Component({
    selector: 'nx-teacher',
    template: `<router-outlet id="outerOutlet"></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        --margin-bottom: 64px;
      }
  
    `],
})

export class TeacherComponent implements OnInit {
    year: Date;
    usernameLogged: string;

    constructor(
        private quizStoreService: QuizStoreService,
        private subjectStoreService: SubjectStoreService,
        private multiDatePickerService: MultiDatePickerService,
        private userLoggedService: UserLoggedService
    ) {
        this.usernameLogged = userLoggedService.getTokenUsername();
    }

    ngOnInit(): void {
        this.multiDatePickerService.date$.subscribe(date => {
            this.year = date;
            this.subjectStoreService.clearStore();
            this.subjectStoreService.loadSubjectsByTeacherAndYear(this.usernameLogged, this.year.getFullYear().toString());
        })
        this.quizStoreService.getTeacherQuizes(this.usernameLogged);
    }


}