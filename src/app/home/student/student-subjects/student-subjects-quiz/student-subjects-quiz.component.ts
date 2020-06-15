import { Component, OnInit, OnDestroy } from '@angular/core';
import { Grade } from '../../../../models/grade';
import { QuizNotificationService } from '../../../../services/quiz-notification.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { CanComponentDeactivate } from '../../../../guards/can-deactivate-guard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'nx-student-subjects-quiz',
  templateUrl: './student-subjects-quiz.component.html',
  styleUrls: ['./student-subjects-quiz.component.css']
})
export class StudentSubjectsQuizComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  subjectId: string;
  studentUsername: string;
  quizFromWebSocket: Grade;
  quizSent: Observable<boolean>;
  gradeToStudent: Grade;
  isDark: boolean;
  isLoading: boolean;
  processing: boolean = false;

  private subscriptions = new Subscription();

  constructor(
    private quizNotificationService: QuizNotificationService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,) {

    if (this.localStorageService.isQuizWebSocketStored()) this.quizFromWebSocket = JSON.parse(this.localStorageService.getQuizWebSocket());

    this.subjectId = this.route.snapshot.paramMap.get('id');
    this.studentUsername = this.route.snapshot.paramMap.get('username');
  }

  ngOnInit() {
    this.subscriptions.add(this.quizNotificationService.notification$
      .subscribe(notification => {
        console.log('noty ', notification);
        if (!this.localStorageService.isQuizWebSocketStored() && notification) {
          this.quizFromWebSocket = notification;
          this.localStorageService.setQuizWebSocket(this.quizFromWebSocket);
        }

      }));

    this.subscriptions.add(this.quizNotificationService.quizSentSource$.subscribe(v => {
      if (v) {
        this.gotoGrades();
      }
    }));

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
