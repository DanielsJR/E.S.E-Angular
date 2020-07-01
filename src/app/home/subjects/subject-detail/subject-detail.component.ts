
import { Component, OnInit, Input, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Subject } from '../../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../../../app.config';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { EvaluationStoreService } from '../../../services/evaluation-store.service';
import { Course } from '../../../models/course';
import { GradeStoreService } from '../../../services/grade-store.service';
import { UserLoggedService } from '../../../services/user-logged.service';
import { User } from '../../../models/user';
import { AttendanceStoreService } from '../../../services/attendance-store.service';
import { subjectRouteAnimations, } from '../../../shared/animations/animations';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'nx-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css'],
  animations: [subjectRouteAnimations]
})

export class SubjectDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  subjectId: string;
  subject: Subject;
  isDark: boolean;
  isLoading: boolean = false;

  subjectsTeacher: Subject[];
  coursesTeacher: Course[];

  subjects: Subject[];
  coursesSubjects: Course[];

  toolbarMenus: any[] = [];

  private subscriptions = new Subscription();

  enableToolbar: boolean;
  currentUrl: string;
  dinamicStyles = {};
  userLogged: User;

  constructor(private route: ActivatedRoute, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService,
    private evaluationStoreService: EvaluationStoreService, private gradeStoreService: GradeStoreService,
    private router: Router, private userLoggedService: UserLoggedService, private attendanceStoreService: AttendanceStoreService,
    private cdRef: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.evaluationStoreService.clearStore();
    this.gradeStoreService.clearStore();
    this.attendanceStoreService.clearStore();

    this.subscriptions.add(this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => this.isLoading = isLoadding));
    this.subscriptions.add(this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark));
    this.currentUrl = this.router.url;
  }

  ngAfterViewInit(): void {
    if (this.route.snapshot.firstChild) {
      this.subscriptions.add(this.route.firstChild.params
        .pipe(
          switchMap(params => {
            this.subjectId = params.id;
            this.evaluationStoreService.getEvaluationsBySubject(this.subjectId);
            this.gradeStoreService.getGradesBySubject(this.subjectId);
            this.attendanceStoreService.getAttendancesBySubject(this.subjectId);
            return this.userLoggedService.userLogged$
          }),

          switchMap(user => {
            this.userLogged = user;
            this.setToolbarMenus(this.subjectId);
            return this.subjectStoreService.loadOneSubject(this.subjectId);
          }),

          switchMap(s => {
            this.subject = s;
            return this.subjectStoreService.subjects$;
          })
        )
        .subscribe(sbjs => {
          this.subjects = sbjs;
          this.coursesSubjects = this.subjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);
          this.subjectsTeacher = sbjs.filter(sj => sj.teacher.id.indexOf(this.subject.teacher.id) === 0);
          this.coursesTeacher = this.subjectsTeacher.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);
        }));

    }

    this.cdRef.detectChanges();

  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getSubjectsTeacherByCourse(course: Course) {
    return this.subjectsTeacher.filter(sj => sj.course.name.indexOf(course.name) === 0);
  }

  getSubjectsByCourse(course: Course) {
    return this.subjects.filter(sj => sj.course.name.indexOf(course.name) === 0);
  }

  getState(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  setToolbarMenus(subjectId): string[] {
    if (this.areaRole === this.roleManager) {
      this.toolbarMenus = [
        { name: 'Curso', route: ['./course', subjectId] },
        { name: 'Evaluaciones', route: ['./evaluations', subjectId] },
        { name: 'Asistencia', route: ['./attendance', subjectId] },
        { name: 'Libro de Clases', route: ['./book', subjectId] },
      ];

    } else if (this.areaRole === this.roleTeacher) {
      this.toolbarMenus = [
        { name: 'Curso', route: ['./course', subjectId] },
        { name: 'Evaluaciones', route: ['./evaluations', subjectId] },
        { name: 'Asistencia', route: ['./attendance', subjectId] },
        { name: 'Libro de Clases', route: ['./book', subjectId] },
        { name: 'Tomar Prueba', route: ['./quiz', subjectId] },
      ];

    } else if (this.areaRole === this.roleStudent) {
      this.toolbarMenus = [
        { name: 'Curso', route: ['./course', subjectId, { username: this.userLogged.username }] },
        { name: 'Mis Asistencias', route: ['./attendance', subjectId, { username: this.userLogged.username }] },
        { name: 'Libro de Clases', route: ['./book', subjectId, { username: this.userLogged.username }] },
        { name: 'Mis Notas', route: ['./grades', subjectId, { username: this.userLogged.username }] },
        { name: 'Rendir Prueba', route: ['./quiz', subjectId, { username: this.userLogged.username }] },
      ];

    } else {
      this.toolbarMenus = [];
      console.error('No areaRol!!');

    }

    return this.toolbarMenus;
  }

  setEnableToolbar(toolbarMenus) {
    let array = this.currentUrl.split('/');
    let currentRoute = './' + array[array.length - 2] + '/' + array[array.length - 1];

    for (let tbm of toolbarMenus) {

      if ((tbm.route[0] + "/" + tbm.route[1]) === currentRoute) {
        this.enableToolbar = true;
        console.log('enableToolbar: ', this.enableToolbar, ' currentUrl: ', currentRoute);
        console.log('filter url: ', (tbm.route[0] + "/" + tbm.route[1]));
        break;

      } else {
        this.enableToolbar = false;
        console.log('enableToolbar: ', this.enableToolbar, ' currentUrl: ', currentRoute);
        console.log('filter url: ', (tbm.route[0] + "/" + tbm.route[1]));
      }

    }

  }


}
