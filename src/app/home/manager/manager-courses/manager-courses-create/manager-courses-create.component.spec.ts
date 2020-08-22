import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ManagerCoursesCreateComponent } from './manager-courses-create.component';
import { ManagerModule } from '../../manager.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpStub, routerLinkStub, ActivatedRouteStub } from '../../../../testing/stubs';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CourseStoreService } from '../../../../services/course-store.service';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { studentTest, teacherTest, httpError403, simpleError } from '../../../../testing/models';
import { asyncData, asyncError } from '../../../../testing/async-helpers';
import { ROLE_TEACHER, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE, ROLE_STUDENT, RESULT_ACTION1, RESULT_SUCCESS, RESULT_ERROR } from '../../../../app.config';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { User } from '../../../../models/user';
import { getSimpleDialogRef, getCardUserDialogRef } from '../../../../testing/function-helpers';
import { click } from '../../../../testing/helper-utilities';


describe('ManagerCreateCourseComponent', () => {
  let component: ManagerCoursesCreateComponent;
  let fixture: ComponentFixture<ManagerCoursesCreateComponent>;
  let courseStoreService: CourseStoreService;
  let snackbarService: SnackbarService;
  let activatedRoute: ActivatedRouteStub;
  let sessionStorageService: SessionStorageService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    const rSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      imports: [ManagerModule, BrowserAnimationsModule],
      providers: [
        { provide: HttpClient, useValue: httpStub },
        { provide: Router, useValue: rSpy },
        { provide: RouterLink, useValue: routerLinkStub },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCoursesCreateComponent);
    component = fixture.componentInstance;

    courseStoreService = TestBed.get(CourseStoreService);
    snackbarService = TestBed.get(SnackbarService);
    sessionStorageService = TestBed.get(SessionStorageService);
    routerSpy = TestBed.get(Router);

    spyOnProperty(sessionStorageService, 'isThemeDark$').and.returnValue(of(false));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate name', () => {
    expect(component.name.valid).toBeFalsy();
    let errors = {};
   
    component.name.setValue('');
    errors = component.name.errors || {};
    expect(errors['required']).toBeTruthy('required error');
    expect(component.name.valid).toBeFalsy('courseName valid required');

    component.name.setValue('1-A');
    errors = component.name.errors || {};
    expect(component.name.valid).toBeTruthy('courseName valid');

  });

  it('should validate year', () => {
    expect(component.year.valid).toBeFalsy();
    let errors = {};
   
    component.year.setValue('');
    errors = component.year.errors || {};
    expect(errors['required']).toBeTruthy('required error');
    expect(component.year.valid).toBeFalsy('courseYear valid required');

    component.year.setValue('2019');
    errors = component.year.errors || {};
    expect(component.year.valid).toBeTruthy('courseYear valid');

  });

  it('should add chiefTeacher', () => {
    expect(component.chiefTeacher).toBeUndefined();
    component.addTeacher(teacherTest);
    fixture.detectChanges();

    expect(component.chiefTeacher).toEqual(teacherTest);

  });

  it('should add student', () => {
    expect(component.listStudents).toEqual([]);
    component.addStudent(studentTest);
    fixture.detectChanges();

    expect(component.listStudents.length).toBe(1);
    expect(component.dataSource.data).toEqual(component.listStudents);
  });

  it('sould delete Student from dialog', fakeAsync(() => {
    component.addStudent(studentTest);
    fixture.detectChanges();
    let simpleDialogRef = getSimpleDialogRef(fixture);

    spyOn(simpleDialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_ACTION1));

    component.deleteStudent(simpleDialogRef);
    simpleDialogRef.componentInstance.action1();

    let student: User = component.dataSource.data.find((s: User) => s.id === simpleDialogRef.componentInstance.obj.id);
    expect(student).toBeTruthy('student found');
    //expect(component.btnDisabled).toBeTruthy('btnDisabled');
    tick();

    let studentDeleted: User = component.dataSource.data.find((s: User) => s.id === simpleDialogRef.componentInstance.obj.id);
    expect(studentDeleted).toBeFalsy('student found');
    //expect(component.btnDisabled).toBeFalsy('btnDisabled');

  }));

  it('should open UserCardCrud teacher', fakeAsync(() => {
    component.addTeacher(teacherTest);
    fixture.detectChanges();

    let dialogRef = getCardUserDialogRef(fixture, ROLE_TEACHER);

    //detail
    let afterClosedSpy = spyOn(dialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_DETAIL));
    let openDialogDetailSpy = spyOn(component.crudUserDialog, 'openDialogDetail')

    component.openUserCardCrud(dialogRef);
    dialogRef.componentInstance.detail();
    tick();
    expect(openDialogDetailSpy).toHaveBeenCalledWith(dialogRef.componentInstance.user);

    //edit
    afterClosedSpy.and.returnValue(asyncData(RESULT_EDIT));
    let openDialogEditSpy = spyOn(component.crudUserDialog, 'openDialogEdit')

    component.openUserCardCrud(dialogRef);
    dialogRef.componentInstance.edit();
    tick();
    expect(openDialogEditSpy).toHaveBeenCalledWith(dialogRef.componentInstance.user);

    //delete
    afterClosedSpy.and.returnValue(asyncData(RESULT_DELETE));
    let openDialogDeleteSpy = spyOn(component.crudUserDialog, 'openDialogDelete')

    component.openUserCardCrud(dialogRef);
    dialogRef.componentInstance.delete();
    tick();
    expect(openDialogDeleteSpy).toHaveBeenCalledWith(dialogRef.componentInstance.user);

    //cancel
    // spyOn(dialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_CANCELED));

  }));

  it('should open UserCardCrud student', fakeAsync(() => {
    component.addStudent(studentTest);
    fixture.detectChanges();

    let dialogRef = getCardUserDialogRef(fixture, ROLE_STUDENT);

    //detail
    let afterClosedSpy = spyOn(dialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_DETAIL));
    let openDialogDetailSpy = spyOn(component.crudUserDialog, 'openDialogDetail')

    component.openUserCardCrud(dialogRef);
    dialogRef.componentInstance.detail();
    tick();
    expect(openDialogDetailSpy).toHaveBeenCalledWith(dialogRef.componentInstance.user);

    //edit
    afterClosedSpy.and.returnValue(asyncData(RESULT_EDIT));
    let openDialogEditSpy = spyOn(component.crudUserDialog, 'openDialogEdit')

    component.openUserCardCrud(dialogRef);
    dialogRef.componentInstance.edit();
    tick();
    expect(openDialogEditSpy).toHaveBeenCalledWith(dialogRef.componentInstance.user);

    //delete
    afterClosedSpy.and.returnValue(asyncData(RESULT_DELETE));
    let openDialogDeleteSpy = spyOn(component.crudUserDialog, 'openDialogDelete')

    component.openUserCardCrud(dialogRef);
    dialogRef.componentInstance.delete();
    tick();
    expect(openDialogDeleteSpy).toHaveBeenCalledWith(dialogRef.componentInstance.user);

    //cancel
    // spyOn(dialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_CANCELED));

  }));

  it('sould set table rows color', () => {
    component.addStudent(studentTest);
    fixture.detectChanges();

    let dialogDebugElements = fixture.debugElement.queryAll(By.css('mat-row'));
    expect(dialogDebugElements.length).toEqual(1);//
    let row = dialogDebugElements[0].nativeElement as HTMLElement;
    expect(component.isDark).toBeFalsy('isDark');
    expect(row.classList.contains('fila')).toBeTruthy('contains fila class');
    expect(row.classList.contains('fila-dark')).toBeFalsy('contains fila-dark class');

    component.isDark = true;
    fixture.detectChanges();
    expect(row.classList.contains('fila')).toBeFalsy('contains fila class');
    expect(row.classList.contains('fila-dark')).toBeTruthy('contains fila class');
  });

  it('sould createCourse', fakeAsync(() => {
    const btnSave: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
    expect(btnSave.disabled).toBeTruthy('btn disabled');
    component.name.setValue('1-C');
    component.year.setValue('2019');
    component.addTeacher(teacherTest);
    component.addStudent(studentTest);
    fixture.detectChanges();
    //expect(btnSave.disabled).toBeFalsy('btn disabled');

    component.course.name = component.createForm.value.name;
    component.course.year = component.createForm.value.year;
    component.course.students = component.listStudents;
    component.course.chiefTeacher = (component.chiefTeacher) ? component.chiefTeacher : null;
    let createSpy = spyOn(courseStoreService, 'create').and.returnValue(asyncData(component.course));
    let openSnackBarSpy = spyOn(snackbarService, 'openSnackBar');

    //click(btnSave);
    component.createCourse();

    tick();
    fixture.detectChanges();
    expect(btnSave.disabled).toBeTruthy('btn disabled');
    expect(createSpy).toHaveBeenCalledWith(component.course);
    expect(openSnackBarSpy).toHaveBeenCalledWith('Curso Creado', RESULT_SUCCESS);
    expect(routerSpy.navigate).toHaveBeenCalled();

    //httpError
    createSpy.and.returnValue(asyncError(httpError403));
    component.createCourse();

    tick();
    expect(btnSave).toBeTruthy('btnDisabled');
    expect(createSpy).toHaveBeenCalledWith(component.course);
    expect(openSnackBarSpy).toHaveBeenCalledWith(httpError403.error.message, RESULT_ERROR);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);

    //other error
    createSpy.and.returnValue(asyncError(simpleError));
    component.createCourse();

    tick();
    expect(btnSave).toBeTruthy('btnDisabled');
    expect(createSpy).toHaveBeenCalledWith(component.course);
    expect(openSnackBarSpy).toHaveBeenCalledWith('Error al Crear curso', RESULT_ERROR);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);

  }));

});
