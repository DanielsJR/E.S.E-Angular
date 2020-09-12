
import { Component, OnInit, Input, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../../../app.config';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { EvaluationStoreService } from '../../../services/evaluation-store.service';
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

  toolbarMenus: any[] = [];

  private subscriptions = new Subscription();

  enableToolbar: boolean;
  currentUrl: string;
  dinamicStyles = {};

  constructor(private route: ActivatedRoute, private router: Router,
    private evaluationStoreService: EvaluationStoreService, private gradeStoreService: GradeStoreService, private attendanceStoreService: AttendanceStoreService,
    private userLoggedService: UserLoggedService,
    private cdRef: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.clearStores();
    this.currentUrl = this.router.url;
  }

  ngAfterViewInit(): void {
    if (this.route.snapshot.firstChild) {
      this.subscriptions.add(this.route.firstChild.params
        .subscribe(params => {
          this.subjectId = params.id;
          this.getStoresByRole(this.subjectId, this.userLoggedService.getTokenUsername());
          this.setToolbarMenus(this.subjectId, this.userLoggedService.getTokenUsername());
        }));
    }

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  clearStores() {
    this.evaluationStoreService.clearStore();
    this.gradeStoreService.clearStore();
    this.attendanceStoreService.clearStore();
  }

  getStoresByRole(subjectId: string, username: string): void {
    if (this.areaRole === this.roleManager) {
      this.gradeStoreService.getGradesBySubject(subjectId);
      this.evaluationStoreService.getEvaluationsBySubject(subjectId);
      this.attendanceStoreService.getAttendancesBySubject(subjectId);

    } else if (this.areaRole === this.roleTeacher) {
      this.gradeStoreService.getTeacherGradesBySubject(subjectId, username);
      this.evaluationStoreService.getTeacherEvaluationsBySubject(subjectId, username);
      this.attendanceStoreService.getAttendancesBySubject(subjectId);//TODO teacher

    } else if (this.areaRole === this.roleStudent) {
      this.gradeStoreService.getStudentGradesBySubject(subjectId, username);
      //this.attendanceStoreService.getAttendancesBySubject(this.subjectId);//TODO student

    } else { console.error("No Area Role!"); }
  }

  setToolbarMenus(subjectId: string, username: string): string[] {
    if (this.areaRole === this.roleManager) {
      this.toolbarMenus = [
        { name: 'Curso', route: ['./course', subjectId] },
        { name: 'Evaluaciones', route: ['./evaluations', subjectId] },
        { name: 'Asistencia', route: ['./attendance', subjectId] },
        //{ name: 'Libro de Clases', route: ['./book', subjectId] },
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
        { name: 'Curso', route: ['./course', subjectId, { username: username }] },
        { name: 'Mis Asistencias', route: ['./attendance', subjectId, { username: username }] },
        { name: 'Libro de Clases', route: ['./book', subjectId, { username: username }] },
        { name: 'Mis Notas', route: ['./grades', subjectId, { username: username }] },
        { name: 'Rendir Prueba', route: ['./quiz', subjectId, { username: username }] },
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

  getState(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }


}
