import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';

@Component({
    template: `<router-outlet></router-outlet>`
})

export class TeacherComponent implements OnInit, OnDestroy {

    constructor(private subjectStoreService: SubjectStoreService) { }

    ngOnInit(): void {
        console.log("TeacherComponent ngOnInit() called!!!");
        this.subjectStoreService.loadSubjects();
    }

    ngOnDestroy() {
        console.log("TeacherComponent ngOnDestroy() called!!!");
    }
}