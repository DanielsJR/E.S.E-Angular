import { Component, OnInit } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';


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

export class TeacherComponent implements OnInit {

    constructor(private userLoggedService: UserLoggedService, private subjectStoreService: SubjectStoreService) { }

    ngOnInit(): void {
        this.userLoggedService.userLogged$
            .subscribe(teacher => this.subjectStoreService.loadSubjects(teacher.id));
    }

}