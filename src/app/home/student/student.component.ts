import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { switchMap } from 'rxjs/operators';
import { CourseBackendService } from '../../services/course-backend.service';
import { of, empty } from 'rxjs';
import { QuizNotificationService } from '../../services/quiz-notification.service';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class StudentComponent implements OnInit, OnDestroy {


    constructor(private userLoggedService: UserLoggedService, private subjectStoreService: SubjectStoreService,
        private courseBackendService: CourseBackendService, private quizNotificationService: QuizNotificationService) { }

    ngOnInit() {
        console.log("StudentComponent ngOnInit() called!!!");
        this.userLoggedService.userLogged$
            .pipe(
                switchMap(student => (student) ? this.courseBackendService.getCourseIdByStudent(student.username, '2018') : empty())
            )
            .subscribe(courseId => this.subjectStoreService.loadSubjects(courseId));

        this.quizNotificationService.getNotification();
    }

    ngOnDestroy() {
        console.log("StudentnComponent ngOnDestroy() called!!!");
    }
}