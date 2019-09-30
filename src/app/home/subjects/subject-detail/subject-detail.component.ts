
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Subject } from '../../../models/subject';
import { DomSanitizer } from '@angular/platform-browser';
import { ROLE_MANAGER, ROLE_TEACHER } from '../../../app.config';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { EvaluationStoreService } from '../../../services/evaluation-store.service';
import { Course } from '../../../models/course';
import { GradeStoreService } from '../../../services/grade-store.service';



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

  toolbarMenus: any[] = [];

  isThemeDarkSubscription: Subscription;
  isLoadingGetSubjectsSubscription: Subscription;
  subjectSubscription: Subscription;

  enableToolbar: boolean;
  currentUrl: string;
  dinamicStyles = {};


  constructor(private route: ActivatedRoute, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
    private evaluationStoreService: EvaluationStoreService, private gradeStoreService: GradeStoreService,
    private router: Router
  ) { }

  ngOnInit() {

    this.subjectSubscription = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          this.currentUrl = this.router.url;
          this.setEnableToolbar();

          this.evaluationStoreService.clearStore();
          this.evaluationStoreService.getEvaluationsBySubject(this.subjectId);

          this.gradeStoreService.clearStore();
          this.gradeStoreService.getGradesBySubject(this.subjectId);

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

        if (this.areaRole === this.roleTeacher) {
          this.toolbarMenus = [
            { name: 'Curso', route: ['./course', this.subjectId] },
            { name: 'Evaluaciones', route: ['./evaluations', this.subjectId] },
            { name: 'Tomar Prueba', route: ['./quiz', this.subjectId] },
            { name: 'Pasar Lista', route: ['./list', this.subjectId] },
            { name: 'Libro de Clases', route: ['./book', this.subjectId] }
          ];
        } else {
          this.toolbarMenus = [
            { name: 'Curso', route: ['./course', this.subjectId] },
            { name: 'Evaluaciones', route: ['./evaluations', this.subjectId] },
          ];
        }


      });

    this.isLoadingGetSubjectsSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);




    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.currentUrl = event.url;
        this.setEnableToolbar();
      }
    });


  }
  setEnableToolbar() {
    let url = this.currentUrl.substring(0, this.currentUrl.lastIndexOf('/'));
    if (url === `/home/manager/subjects/detail/${this.subjectId}/grades` || url === `/home/teacher/subjects/detail/${this.subjectId}/grades`) {
      this.enableToolbar = false;
      this.dinamicStyles = { 'top': '0' };
    } else {
      this.enableToolbar = true;
      this.dinamicStyles = { 'top': '64px' };
    }
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
