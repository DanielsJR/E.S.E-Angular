import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ManagerCoursesDetailComponent } from './manager-courses-detail.component';
import { ManagerModule } from '../../manager.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpStub, routerStub, routerLinkStub, activatedRouteStub, ActivatedRouteStub } from '../../../../testing/stubs';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CourseStoreService } from '../../../../services/course-store.service';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { of } from 'rxjs';
import { courseTest, courseTest2, studentTest3, studentTest, teacherTest2, simpleError, httpError403 } from '../../../../testing/models';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CardUserDialogComponent } from '../../../users/card-user-dialog/card-user-dialog.component';
import { ROLE_TEACHER, ROLE_STUDENT, RESULT_ACTION1, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE, RESULT_CANCELED, RESULT_SUCCESS, RESULT_ERROR } from '../../../../app.config';
import { asyncData, asyncError } from '../../../../testing/async-helpers';
import { User } from '../../../../models/user';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { SimpleDialogComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog.component';
import { Course } from '../../../../models/course';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { click } from '../../../../testing/helper-utilities';
import { getCardUserDialogRef, getSimpleDialogRef } from '../../../../testing/function-helpers';



describe('ManagerCoursesDetailComponent', () => {
  let component: ManagerCoursesDetailComponent;
  let fixture: ComponentFixture<ManagerCoursesDetailComponent>;
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
    fixture = TestBed.createComponent(ManagerCoursesDetailComponent);
    component = fixture.componentInstance;

    courseStoreService = TestBed.get(CourseStoreService);
    snackbarService = TestBed.get(SnackbarService);
    sessionStorageService = TestBed.get(SessionStorageService);
    routerSpy = TestBed.get(Router);

    activatedRoute.setParamMap({ name: courseTest.name });
    spyOn(courseStoreService, 'loadOneCourse').and.returnValue(of(courseTest));
    spyOnProperty(sessionStorageService, 'isThemeDark$').and.returnValue(of(false));
    //spyOnProperty(courseStoreService, 'isLoadingGetCourses$').and.returnValue(of(false));
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.course).toBeTruthy();
    expect(component.chiefTeacher).toBeTruthy();
    expect(component.dataSource.data).toBeTruthy();
    expect(component.listStudents).toEqual(component.dataSource.data);
  });

  it('should open UserCardCrud', fakeAsync(() => {
    let dialogRef = getCardUserDialogRef(fixture,ROLE_TEACHER);

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

  it('sould addStudentToDataSource', fakeAsync(() => {
    let student: User = component.dataSource.data.find((s: User) => s.id === studentTest3.id);
    expect(student).toBeFalsy('student found');
    expect(component.btnDisabled).toBeTruthy('btnDisabled');

    component.addStudentToDataSource(studentTest3);
    tick();
    let studentAdded: User = component.dataSource.data.find((s: User) => s.id === studentTest3.id);
    expect(studentAdded).toBeTruthy('student found');
    expect(component.btnDisabled).toBeFalsy('btnDisabled');

  }));

  it('sould delete Student from dialog', fakeAsync(() => {
    let simpleDialogRef = getSimpleDialogRef(fixture);

    spyOn(simpleDialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_ACTION1));
    //let deleteStudentFromDataSourceSpy = spyOn(component, 'deleteStudentFromDataSource').and.callThrough(); // private method

    component.deleteStudent(simpleDialogRef);
    simpleDialogRef.componentInstance.action1();

    let student: User = component.dataSource.data.find((s: User) => s.id === simpleDialogRef.componentInstance.obj.id);
    expect(student).toBeTruthy('student found');
    expect(component.btnDisabled).toBeTruthy('btnDisabled');
    tick();
    //expect(deleteStudentFromDataSourceSpy).toHaveBeenCalledWith(simpleDialogRef); 

    let studentDeleted: User = component.dataSource.data.find((s: User) => s.id === simpleDialogRef.componentInstance.obj.id);
    expect(studentDeleted).toBeFalsy('student found');
    expect(component.btnDisabled).toBeFalsy('btnDisabled');

  }));

  it('sould changeTeacher', () => {
    expect(component.btnDisabled).toBeTruthy('btnDisabled');
    expect(component.chiefTeacher).not.toEqual(teacherTest2);

    component.changeTeacher(teacherTest2);

    expect(component.chiefTeacher).toEqual(teacherTest2);
    expect(component.btnDisabled).toBeFalsy('btnDisabled');

  });

  it('sould saveCourse', fakeAsync(() => {
    const btnSave: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
    expect(btnSave.disabled).toBeTruthy('btn disabled');
    component.changeTeacher(teacherTest2);
    fixture.detectChanges();
    expect(btnSave.disabled).toBeFalsy('btn disabled');


    let courseEdit: Course = Object.assign({}, component.course);
    courseEdit.chiefTeacher = component.chiefTeacher;
    courseEdit.students = component.listStudents;
    let updateSpy = spyOn(courseStoreService, 'update').and.returnValue(asyncData(courseEdit));
    let openSnackBarSpy = spyOn(snackbarService, 'openSnackBar');

    click(btnSave);
    // component.saveCourse();

    tick();
    fixture.detectChanges();
    expect(btnSave.disabled).toBeTruthy('btn disabled');
    expect(updateSpy).toHaveBeenCalledWith(courseEdit);
    expect(openSnackBarSpy).toHaveBeenCalledWith('Curso Actualizado', RESULT_SUCCESS);

    //httpError
    updateSpy.and.returnValue(asyncError(httpError403));
    component.saveCourse();

    tick();
    expect(component.btnDisabled).toBeTruthy('btnDisabled');
    expect(updateSpy).toHaveBeenCalledWith(courseEdit);
    expect(openSnackBarSpy).toHaveBeenCalledWith(httpError403.error.message, RESULT_ERROR);

    //other error
    updateSpy.and.returnValue(asyncError(simpleError));
    component.saveCourse();

    tick();
    expect(component.btnDisabled).toBeTruthy('btnDisabled');
    expect(updateSpy).toHaveBeenCalledWith(courseEdit);
    expect(openSnackBarSpy).toHaveBeenCalledWith('Error al Actualizar curso', RESULT_ERROR);

  }));

  it('sould set table rows color', () => {
    let dialogDebugElements = fixture.debugElement.queryAll(By.css('mat-row'));
    expect(dialogDebugElements.length).toEqual(2);//two students
    let row = dialogDebugElements[0].nativeElement as HTMLElement;
    expect(component.isDark).toBeFalsy('isDark');
    expect(row.classList.contains('fila')).toBeTruthy('contains fila class');
    expect(row.classList.contains('fila-dark')).toBeFalsy('contains fila-dark class');

    component.isDark = true;
    fixture.detectChanges();
    expect(row.classList.contains('fila')).toBeFalsy('contains fila class');
    expect(row.classList.contains('fila-dark')).toBeTruthy('contains fila class');
  });

  it('should go to courses', () => {
    component.gotoCourses();
    const spy = routerSpy.navigate as jasmine.Spy;
    const navArgs: string = spy.calls.first().args[0][0];
    expect(navArgs).toBe('../');

  });



});
