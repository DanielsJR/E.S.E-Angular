
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Subject } from '../../../models/subject';
import { DomSanitizer } from '@angular/platform-browser';
import { ROLE_MANAGER, ROLE_TEACHER } from '../../../app.config';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { EvaluationStoreService } from '../../../services/evaluation-store.service';
import { Course } from '../../../models/course';



@Component({
  selector: 'nx-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css'],
})

export class SubjectDetailComponent implements OnInit, OnDestroy {

  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  subjectId: string;
  subject: Subject;
  isDark: boolean;
  isLoading: boolean = false;

  subjectsTeacher: Subject[];
  coursesTeacher: Course[];

  subjects: Subject[];
  coursesSubjects: Course[];


  isThemeDarkSubscription: Subscription;
  isLoadingGetSubjectsSubscription: Subscription;
  subjectSubscription: Subscription;


  constructor(
    private route: ActivatedRoute, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
    private evaluationStoreService: EvaluationStoreService,
    private router: Router,
  ) {

  }

  ngOnInit() {

    this.subjectSubscription = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          this.evaluationStoreService.clearStore();
          this.evaluationStoreService.getEvaluationsBySubject(this.subjectId);
          return this.subjectStoreService.loadOneSubject(this.subjectId);
        }), switchMap(s => {
          this.subject = s;
          return this.subjectStoreService.subjects$;
        })
      )
      .subscribe(sbjs => {
        this.subjects = sbjs;
        this.coursesSubjects = this.subjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);
        
        this.subjectsTeacher = sbjs.filter(sj => sj.teacher.id.indexOf(this.subject.teacher.id) === 0);
        this.coursesTeacher = this.subjectsTeacher.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);

      });

    this.isLoadingGetSubjectsSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);

  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.isLoadingGetSubjectsSubscription.unsubscribe();
    this.subjectSubscription.unsubscribe();

  }

  navigateSubject(id: string) {
    let currentUrl = this.router.url;
    let arrayUrl = currentUrl.split('/');
    let path = arrayUrl[arrayUrl.length - 2];
    this.router.navigate(['../' + id + '/' + path, id], { relativeTo: this.route });

  }

  getSubjectsTeacherByCourse(course: Course) {
    return this.subjectsTeacher.filter(sj => sj.course.name.indexOf(course.name) === 0);
  }

  getSubjectsByCourse(course: Course) {
    return this.subjects.filter(sj => sj.course.name.indexOf(course.name) === 0);
  }

}
