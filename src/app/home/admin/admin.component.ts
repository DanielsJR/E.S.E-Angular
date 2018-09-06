import { Component } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
    template: `<router-outlet></router-outlet>`
})
export class AdminComponent {
    constructor(
        private userStoreService: UserStoreService,
        private courseStoreService: CourseStoreService
    ) { }

    ngOnInit(): void {
        this.userStoreService.getManagers();
        this.userStoreService.getTeachers();
        this.userStoreService.getStudents();
        
        this.courseStoreService.getCourses(2018);

    }
}