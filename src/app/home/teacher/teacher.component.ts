import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';

@Component({
    template: `<router-outlet></router-outlet>`
})

export class TeacherComponent implements OnInit, OnDestroy {

    constructor(private userLoggedService: UserLoggedService, private subjectStoreService: SubjectStoreService) { }

    ngOnInit(): void {
        console.log("TeacherComponent ngOnInit() called!!!");
        this.userLoggedService.userLogged$
            .subscribe(teacher => this.subjectStoreService.loadSubjects(teacher.id));
    }

    ngOnDestroy() {
        console.log("TeacherComponent ngOnDestroy() called!!!");
    }
}