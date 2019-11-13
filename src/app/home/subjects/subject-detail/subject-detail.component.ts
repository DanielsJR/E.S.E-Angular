
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Subject } from '../../../models/subject';
import { DomSanitizer } from '@angular/platform-browser';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../../../app.config';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { EvaluationStoreService } from '../../../services/evaluation-store.service';
import { Course } from '../../../models/course';
import { GradeStoreService } from '../../../services/grade-store.service';
import { UserLoggedService } from '../../../services/user-logged.service';
import { User } from '../../../models/user';
import { AttendanceStoreService } from '../../../services/attendance-store.service';



@Component({
  selector: 'nx-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css'],
})

export class SubjectDetailComponent implements OnInit, OnDestroy {

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

  isThemeDarkSubscription: Subscription;
  isLoadingGetSubjectsSubscription: Subscription;
  subjectSubscription: Subscription;

  enableToolbar: boolean;
  currentUrl: string;
  dinamicStyles = {};
  userLogged: User;

  constructor(private route: ActivatedRoute, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
    private evaluationStoreService: EvaluationStoreService, private gradeStoreService: GradeStoreService,
    private router: Router, private userLoggedService: UserLoggedService, private attendanceStoreService: AttendanceStoreService,
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

          this.attendanceStoreService.clearStore();
          this.attendanceStoreService.getAttendancesBySubject(this.subjectId);

          return this.userLoggedService.userLogged$
        }),

        switchMap(user => {
          this.userLogged = user;
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

        if (this.areaRole === this.roleManager) {
          this.toolbarMenus = [
            { name: 'Curso', route: ['./course', this.subjectId] },
            { name: 'Evaluaciones', route: ['./evaluations', this.subjectId] },
            { name: 'Asistencia', route: ['./attendance', this.subjectId] },
          ];

        } else if (this.areaRole === this.roleTeacher) {
          this.toolbarMenus = [
            { name: 'Curso', route: ['./course', this.subjectId] },
            { name: 'Evaluaciones', route: ['./evaluations', this.subjectId] },
            { name: 'Tomar Prueba', route: ['./quiz', this.subjectId] },
            { name: 'Asistencia', route: ['./attendance', this.subjectId] },
            { name: 'Libro de Clases', route: ['./book', this.subjectId] }
          ];

        } else if (this.areaRole === this.roleStudent) {
          this.toolbarMenus = [
            { name: 'Curso', route: ['./course', this.subjectId, { username: this.userLogged.username }] },
            { name: 'Mis Notas', route: ['./grades', this.subjectId, { username: this.userLogged.username }] },
            { name: 'Rendir Prueba', route: ['./quiz', this.subjectId, { username: this.userLogged.username }] },
            { name: 'Mis Asistencias', route: ['./attendance', this.subjectId, { username: this.userLogged.username }] },
            { name: 'Libro de Clases', route: ['./book', this.subjectId, { username: this.userLogged.username }] }
          ];

        } else {
          console.error('No areaRol!!');
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
      //console.log('enableToolbar: false');
    } else {
      this.enableToolbar = true;
      this.dinamicStyles = { 'top': '64px' };
      //console.log('enableToolbar: true');
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
    this.router.navigate(['../' + id + '/' + path, id, { username: this.userLogged.username }], { relativeTo: this.route });

  }

  getSubjectsTeacherByCourse(course: Course) {
    return this.subjectsTeacher.filter(sj => sj.course.name.indexOf(course.name) === 0);
  }

  getSubjectsByCourse(course: Course) {
    return this.subjects.filter(sj => sj.course.name.indexOf(course.name) === 0);
  }

}
