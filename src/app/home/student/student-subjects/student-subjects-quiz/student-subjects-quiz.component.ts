import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { User } from '../../../../models/user';
import { Grade } from '../../../../models/grade';
import { QuizNotificationService } from '../../../../services/quiz-notification.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { CanComponentDeactivate } from '../../../../guards/can-deactivate-guard.service';
import { tap } from 'rxjs/internal/operators/tap';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'nx-student-subjects-quiz',
  templateUrl: './student-subjects-quiz.component.html',
  styleUrls: ['./student-subjects-quiz.component.css']
})
export class StudentSubjectsQuizComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  subjectId: string;
  studentUsername: string;

  getQuizNotificationSubscription: Subscription;
  quizSentNotificationSubscription: Subscription;
  quizFromWebSocket: Grade;
  quizSent: Observable<boolean>;
  gradeToStudent: Grade;

  isThemeDarkSubscription: Subscription;
  isDark: boolean;
  isLoading: boolean;
  processing: boolean = false;

  constructor(
    private quizNotificationService: QuizNotificationService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router, ) {

    if (this.localStorageService.isQuizWebSocketStored()) this.quizFromWebSocket = JSON.parse(this.localStorageService.getQuizWebSocket());

    this.subjectId = this.route.snapshot.paramMap.get('id');
    this.studentUsername = this.route.snapshot.paramMap.get('username');
  }

  ngOnInit() {
    this.getQuizNotificationSubscription = this.quizNotificationService.notification$
      .subscribe(notification => {
        console.log('noty ', notification);
        if (!this.localStorageService.isQuizWebSocketStored() && notification) {
          this.quizFromWebSocket = notification;
          this.localStorageService.setQuizWebSocket(this.quizFromWebSocket);
        }

      });

    this.quizSentNotificationSubscription = this.quizNotificationService.quizSentSource$.subscribe(v => {
      if (v) {
        this.gotoGrades();
      }
    });

  }

  ngOnDestroy(): void {
    this.getQuizNotificationSubscription.unsubscribe();
    this.quizSentNotificationSubscription.unsubscribe();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.localStorageService.isQuizWebSocketStored()) return true;

    return this.quizNotificationService.quizSentSource$;
  }

  didQuizSend(value: boolean) {
    if (value) {
      this.quizFromWebSocket = null;
      this.localStorageService.removeQuizWebSocket();
      this.quizNotificationService.clearNotification();
      this.processing = true;
    }

  }

  gotoGrades() {
    this.router.navigate(['../../grades', this.subjectId, { username: this.studentUsername }], { relativeTo: this.route });
  }


}
