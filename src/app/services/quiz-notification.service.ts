import { RxStompService } from "@stomp/ng2-stompjs";
import { UserLoggedService } from "./user-logged.service";
import { CourseBackendService } from "./course-backend.service";
import { Message } from '@stomp/stompjs';
import { Grade } from "../models/grade";
import { User } from "../models/user";
import { GradeStoreService } from "./grade-store.service";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { empty } from 'rxjs/internal/observable/empty';


@Injectable({
    providedIn: 'root',
})
export class QuizNotificationService {

    private notificationSource = new BehaviorSubject<Grade>(null);//new ReplaySubject<Grade>(1);
    private quizSentSource = new Subject<boolean>();

    private student: User;
    private gradeToStudent: Grade;

    constructor(private rxStompService: RxStompService, private userLoggedService: UserLoggedService,
        private courseBackendService: CourseBackendService, private gradeStoreService: GradeStoreService) { }

    get notification$() {
        return this.notificationSource.asObservable();
    }

    get quizSentSource$() {
        return this.quizSentSource.asObservable();
    }

    getNotification() {
        console.log(`********GET-getQuizNotification*******`);
        this.userLoggedService.userLogged$
            .pipe(
                switchMap(user => {
                    this.student = user;
                    return (this.student) ? this.courseBackendService.getCourseIdByStudent(this.student.username, '2018') : empty();
                }),
                switchMap(courseId => {
                    return this.rxStompService.watch(`/topic/send-quiz/course/${courseId}`);
                }),

                switchMap((message: Message) => {
                    let grade: Grade;
                    grade = JSON.parse(message.body);
                    grade.student = this.student;
                    this.notificationSource.next(grade);

                    return this.rxStompService.watch(`/topic/grade-to-student/student/${this.student.id}`);
                }),
            )
            .subscribe((message: Message) => {
                this.gradeToStudent = JSON.parse(message.body);
                this.gradeStoreService.updateGradeInDataStore(this.gradeToStudent);
                this.setQuizSent(true);
            }, error => console.error('error retrieving notification, ' + error.message)
            );
    }

    setQuizSent(value:boolean) {
        console.log("****************setQuizSent******************");
        this.quizSentSource.next(value);

    }

    clearNotification() {
        console.log("****************clearQuizNotification******************");
        this.notificationSource.next(null);

    }

}
