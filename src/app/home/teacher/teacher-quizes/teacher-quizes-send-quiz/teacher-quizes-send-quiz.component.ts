import { Component, OnInit } from '@angular/core';

import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { RxStompService } from '@stomp/ng2-stompjs';
import { TOPIC_NOTIFICATION, APP_NOTIFICATION } from '../../../../app.config';

@Component({
  selector: 'nx-teacher-quizes-send-quiz',
  templateUrl: './teacher-quizes-send-quiz.component.html',
  styleUrls: ['./teacher-quizes-send-quiz.component.css']
})
export class TeacherQuizesSendQuizComponent implements OnInit {
  notifications: any = 0;

  private notificationSubscription: Subscription;

  constructor(private rxStompService: RxStompService) { }

  ngOnInit() {
    this.notificationSubscription = this.rxStompService.watch(`${TOPIC_NOTIFICATION}`).subscribe((message: Message) => {
      this.notifications = JSON.parse(message.body).count;
    });
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
  }

  sendNotification() {
    this.rxStompService.publish({ destination: `${APP_NOTIFICATION}`, body: this.notifications });
  }

}
