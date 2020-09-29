import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MultiDatePickerService } from '../../shared/multi-date-picker/multy-date-picker.service';


@Component({
    selector: 'nx-teacher',
    template: `<router-outlet id="outerOutlet"></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        margin-bottom: 64px;
      }
  
    `],
})

export class TeacherComponent implements OnInit {


    year: Date;

    constructor(private subjectStoreService: SubjectStoreService,
        private multiDatePickerService: MultiDatePickerService,
        private userLoggedService: UserLoggedService) { }

    ngOnInit(): void {
        this.multiDatePickerService.date$.subscribe(date => {
            this.year = date;
            this.subjectStoreService.clearStore();
            this.subjectStoreService.loadSubjectsByTeacherAndYear(this.userLoggedService.getTokenUsername(), this.year.getFullYear().toString());
        })
    }


}