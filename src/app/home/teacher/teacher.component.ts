import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
    template: `<router-outlet id="outerOutlet"></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        height: 100%;
      }
  
    `],
})

export class TeacherComponent implements OnInit, OnDestroy {

    private subscriptions = new Subscription();

    constructor(private userLoggedService: UserLoggedService, private subjectStoreService: SubjectStoreService) { }

    ngOnInit(): void {
        this.subscriptions.add(this.userLoggedService.userLogged$
            .subscribe(teacher => this.subjectStoreService.loadSubjects(teacher.id)));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}