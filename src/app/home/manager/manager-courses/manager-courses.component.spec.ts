import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ManagerCoursesComponent } from './manager-courses.component';
import { ManagerModule } from '../manager.module';
import { httpStub, routerStub, routerLinkStub, activatedRouteStub, RouterLinkDirectiveStub, ActivatedRouteStub, RouterOutletStubComponent } from '../../../testing/stubs';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CourseStoreService } from '../../../services/course-store.service';
import { courseTest, courseTest2 } from '../../../testing/models';
import { asyncData } from '../../../testing/async-helpers';

import { SimpleDialogRefComponent } from '../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { By } from '@angular/platform-browser';
import { SimpleDialogComponent } from '../../../shared/dialogs/simple-dialog/simple-dialog.component';
import { RESULT_ACTION1, RESULT_SUCCEED, RESULT_CANCELED } from '../../../app.config';
import { SnackbarService } from '../../../shared/snackbars-ref/snackbar.service';
import { of } from 'rxjs/internal/observable/of';
import { DebugElement } from '@angular/core';
import { click } from '../../../testing/helper-utilities';
import { ManagerRoutingModule } from '../manager.routing';
import { getSimpleDialogRef } from '../../../testing/function-helpers';


describe('ManagerCoursesComponent', () => {
  let component: ManagerCoursesComponent;
  let fixture: ComponentFixture<ManagerCoursesComponent>;
  let courseStoreService: CourseStoreService;
  let snackbarService: SnackbarService;

  let routerLinks: RouterLinkDirectiveStub[];
  let linkDes: DebugElement[];

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        ManagerModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: HttpClient, useValue: httpStub },
        { provide: Router, useValue: routerStub },
        { provide: RouterLink, useValue: routerLinkStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    })
      .overrideModule(ManagerModule, {
        remove: {
          imports: [ManagerRoutingModule]
        },
        add: {
          declarations: [RouterLinkDirectiveStub, RouterOutletStubComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCoursesComponent);
    component = fixture.componentInstance;

    courseStoreService = TestBed.get(CourseStoreService);
    snackbarService = TestBed.get(SnackbarService);

    //spyOnProperty(courseStoreService, 'isLoadingGetCourses$').and.returnValue(of(false));

    let courses = [courseTest, courseTest2];
    spyOnProperty(courseStoreService, 'courses$').and.returnValue(of(courses));

    fixture.detectChanges();

    // find DebugElements with an attached RouterLinkStubDirective
    linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances
    // using each DebugElement's injector
    routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    //spyOnProperty(courseStoreService, 'isLoadingGetCourses$').and.returnValue(of(false));
    fixture.detectChanges();

  })

  it('should create', () => {
    expect(component).toBeTruthy();
    let simpleDialogDebugElements = fixture.debugElement.queryAll(By.css('nx-simple-dialog'));
    expect(simpleDialogDebugElements.length).toEqual(2);
  });

  it('should test dialogAction delete ', fakeAsync(() => {
    let simpleDialogRef = getSimpleDialogRef(fixture);

    spyOn(simpleDialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_ACTION1));
    let deleteCourseSpy = spyOn(component, 'deleteCourse');

    component.dialogAction(simpleDialogRef);
    simpleDialogRef.componentInstance.action1();
    tick();
    expect(deleteCourseSpy).toHaveBeenCalledWith(simpleDialogRef);


  }));

  it('should test dialogAction  cancel', fakeAsync(() => {
    let simpleDialogRef = getSimpleDialogRef(fixture);

    spyOn(simpleDialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_CANCELED));
    let deleteCourseSpy = spyOn(component, 'deleteCourse');

    component.dialogAction(simpleDialogRef);
    simpleDialogRef.componentInstance.cancel();
    tick();
    expect(deleteCourseSpy).not.toHaveBeenCalled();

  }));

  it('should delete course', fakeAsync(() => {
    let simpleDialogRef = getSimpleDialogRef(fixture);

    spyOn(simpleDialogRef, 'afterClosed').and.returnValue(asyncData(RESULT_ACTION1));
    let openSnackBarSpy = spyOn(snackbarService, 'openSnackBar');
    let deleteSpy = spyOn(courseStoreService, 'delete').and.returnValue(asyncData(courseTest));

    component.deleteCourse(simpleDialogRef);
    simpleDialogRef.componentInstance.action1();
    expect(component.isLoadingGet).toBeTruthy('isLoading');
    tick();
    expect(component.isLoadingGet).toBeFalsy('isLoading');
    expect(deleteSpy).toHaveBeenCalled();
    expect(openSnackBarSpy).toHaveBeenCalledWith('Curso: ' + simpleDialogRef.componentInstance.obj.name + ' eliminado', RESULT_SUCCEED);

  }));

  it('can get RouterLinks from template', () => {
    expect(linkDes.length).toEqual(5);
    expect(routerLinks.length).toBe(5, 'should have 5 routerLinks');
    expect(routerLinks[0].linkParams).toEqual(['./create']);
    expect(routerLinks[1].linkParams).toEqual(['./', courseTest.name]);
    expect(routerLinks[2].linkParams).toEqual(['./', courseTest.name]);
    expect(routerLinks[3].linkParams).toEqual(['./', courseTest2.name]);
    expect(routerLinks[4].linkParams).toEqual(['./', courseTest2.name]);

  });

  it('can click to create a new course in the template', () => {
    const newCourseLinkDe = linkDes[0];   // courses link DebugElement
    const newCourseLink = routerLinks[0]; // courses link directive

    expect(newCourseLink.navigatedTo).toBeNull('should not have navigated yet');

    click(newCourseLinkDe);
    fixture.detectChanges();

    expect(newCourseLink.navigatedTo).toEqual(['./create']);
  });

  it('can click to course detail in the template (button)', () => {
    const newCourseLinkDe = linkDes[1];   // courses link DebugElement
    const newCourseLink = routerLinks[1]; // courses link directive

    expect(newCourseLink.navigatedTo).toBeNull('should not have navigated yet');

    click(newCourseLinkDe);
    fixture.detectChanges();

    expect(newCourseLink.navigatedTo).toEqual(['./', courseTest.name]);
  });

  it('can click to course detail in the template (table row)', () => {
    const newCourseLinkDe = linkDes[2];   // courses link DebugElement
    const newCourseLink = routerLinks[2]; // courses link directive

    expect(newCourseLink.navigatedTo).toBeNull('should not have navigated yet');

    click(newCourseLinkDe);
    fixture.detectChanges();

    expect(newCourseLink.navigatedTo).toEqual(['./', courseTest.name]);
  });

  it('sould set table rows color', () => {
    let dialogDebugElements = fixture.debugElement.queryAll(By.css('mat-row'));
    expect(dialogDebugElements.length).toEqual(2);//two students
    let row = dialogDebugElements[0].nativeElement as HTMLElement;

    expect(row.classList.contains('fila')).toBeTruthy('contains fila class');
    expect(row.classList.contains('fila-dark')).toBeFalsy('contains fila-dark class');

    fixture.detectChanges();
    expect(row.classList.contains('fila')).toBeFalsy('contains fila class');
    expect(row.classList.contains('fila-dark')).toBeTruthy('contains fila class');
  });


});



