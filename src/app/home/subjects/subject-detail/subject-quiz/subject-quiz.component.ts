import { Component, OnInit, Input } from '@angular/core';
import { Grade } from '../../../../models/grade';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { GradeStoreService } from '../../../../services/grade-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../../../services/snackbar.service';
import { Subject } from '../../../../models/subject';
import { User } from '../../../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nx-subject-quiz',
  templateUrl: './subject-quiz.component.html',
  styleUrls: ['./subject-quiz.component.css']
})
export class SubjectQuizComponent implements OnInit {


  @Input() areaRole;
  grade: Grade;// = new Grade();

  student: User;
  subject: Subject;

  studentName: string;
  subjectId: string;

  isThemeDarkSubscription: Subscription;
  isLoadingGetGradesSubscription: Subscription;
  gradesSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private gradeStoreService: GradeStoreService, private sessionStorage: SessionStorageService,
    public sanitizer: DomSanitizer, private snackbarService: SnackbarService) {

      this.studentName = this.route.snapshot.paramMap.get('username');
      this.subjectId = this.route.snapshot.paramMap.get('id');
      this.gradesSubscription = this.gradeStoreService.grades$
        .subscribe(grades => {
          if (grades) {
            this.grade = grades.find(g => (g.student.username.indexOf(this.studentName) === 0) && (g.evaluation.subject.id.indexOf(this.subjectId) === 0))
            if (this.grade) {
              this.subject = this.grade.evaluation.subject;
              this.student = this.grade.student;
            }
          }
        });
     }



  ngOnInit() {



  }


}
