import { Component, OnInit } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { switchMap } from 'rxjs/operators';
import { CourseBackendService } from '../../services/course-backend.service';
import { empty } from 'rxjs';
import { QuizNotificationService } from '../../services/quiz-notification.service';


@Component({
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    
    `],
})
export class StudentComponent implements OnInit {


    constructor(private userLoggedService: UserLoggedService, private subjectStoreService: SubjectStoreService,
        private courseBackendService: CourseBackendService, private quizNotificationService: QuizNotificationService) { }

    ngOnInit() {
        this.userLoggedService.userLogged$
            .pipe(
                switchMap(student => (student) ? this.courseBackendService.getCourseIdByStudent(student.username, '2018') : empty())
            )
            .subscribe(courseId => this.subjectStoreService.loadSubjects(courseId));

        this.quizNotificationService.getNotification();
    }

}