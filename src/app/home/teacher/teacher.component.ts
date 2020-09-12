import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { Subscription } from 'rxjs/internal/Subscription';


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

export class TeacherComponent implements OnInit, OnDestroy {

    private subscriptions = new Subscription();

    constructor(private userLoggedService: UserLoggedService, private subjectStoreService: SubjectStoreService) { }

    ngOnInit(): void {
        this.subjectStoreService.loadSubjectsByTeacherAndYear(this.userLoggedService.getTokenUsername(), '2018');
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}