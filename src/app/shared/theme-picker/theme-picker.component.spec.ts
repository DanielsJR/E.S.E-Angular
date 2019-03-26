import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { ThemePickerComponent } from './theme-picker.component';
import { ThemePickerModule } from './theme-picker.module';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../../testing/stubs';
import { UserLoggedService } from '../../services/user-logged.service';
import { click } from '../../testing/click-helper';
import { ThemeService } from './theme.service';
import { managerTest, adminTest } from '../../testing/models';
import { Theme } from './theme';
import { JsonPipe } from '@angular/common';
import { stringify } from '@angular/core/src/util';
import { SessionStorageService } from '../../services/session-storage.service';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement, SimpleChange } from '@angular/core';
import { THEMESLIGHT } from './themes';
import { asyncData } from '../../testing/async-helpers';

describe('Theme Picker Component', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let debugElement: any;

  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  let userLoggedService: UserLoggedService;
  let themeService: ThemeService;
  let sessionStorageService: SessionStorageService;

  let themeDarkTest: Theme = { name: 'pink-purple-dark', color: '#E91E63', isDark: true };
  //let themeLightTest: Theme = { name: 'pink-purple', color: '#E91E63', isDark: false };
  let themeLightTest: Theme = { name: 'red-indigo', color: '#F44336', isDark: false };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ThemePickerModule, BrowserAnimationsModule],
      providers: [
        //ThemeService,
        { provide: HttpClient, useValue: httpStub },
      ]
    })
      .compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userLoggedService = TestBed.get(UserLoggedService);
    themeService = TestBed.get(ThemeService);
    sessionStorageService = TestBed.get(SessionStorageService);

    debugElement = fixture.debugElement;

  });

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();

    sessionStorage.clear();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should install initial Theme', () => {
    expect(component.themeName).toEqual('indigo-pink'); // default
    component.isInstalled = false;
    component.initialTheme = themeDarkTest;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.themeName).toEqual(themeDarkTest.name);

  });

  it('should install DarkTheme by clicking', () => {
    component.installTheme(themeLightTest);
    fixture.detectChanges();

    expect(component.isDark).toBeFalsy();
    let btnDark = debugElement.nativeElement.querySelector('#btnDark');

    component.user = adminTest;
    let hasPrivilegesSpy = spyOn(userLoggedService, 'hasPrivileges').and.returnValue(true);
    let saveThemeSpy = spyOn(themeService, 'saveTheme').and.returnValue(asyncData(true));

    click(btnDark);
    expect(component.isDark).toBeTruthy();
    let ocClasses = component.overlayContainer.getContainerElement().classList;
    expect(ocClasses.contains(themeLightTest.name + '-dark')).toBeTruthy();
    expect(ocClasses.contains(themeLightTest.name)).toBeFalsy();

    expect(hasPrivilegesSpy).toHaveBeenCalled();
    expect(saveThemeSpy).toHaveBeenCalled();
  });

  it('should install LightTheme by clicking', () => {
    component.installTheme(themeDarkTest);
    fixture.detectChanges();

    expect(component.isDark).toBeTruthy();
    let btnLight = debugElement.nativeElement.querySelector('#btnLight');

    component.user = adminTest;
    let hasPrivilegesSpy = spyOn(userLoggedService, 'hasPrivileges').and.returnValue(true);
    let saveThemeSpy = spyOn(themeService, 'saveTheme').and.returnValue(asyncData(true));

    click(btnLight);
    expect(component.isDark).toBeFalsy();
    let ocClasses = component.overlayContainer.getContainerElement().classList;
    expect(ocClasses.contains(themeDarkTest.name.slice(0, -5))).toBeTruthy();
    expect(ocClasses.contains(themeDarkTest.name)).toBeFalsy();

    expect(hasPrivilegesSpy).toHaveBeenCalled();
    expect(saveThemeSpy).toHaveBeenCalled();
  });

  it('should install Theme by clicking', () => {
    
    component.user = adminTest;
    let hasPrivilegesSpy = spyOn(userLoggedService, 'hasPrivileges').and.returnValue(true);
    let saveThemeSpy = spyOn(themeService, 'saveTheme').and.returnValue(asyncData(true));

    let btnMenu = debugElement.nativeElement.querySelector('#btnMenu');
    click(btnMenu);
    fixture.detectChanges();

    let menuItems: HTMLElement[] = Array.from(overlayContainerElement.querySelectorAll('.mat-menu-item'));
    expect(menuItems.length).toBeGreaterThan(0);
    let item = menuItems[8]; // { name: 'teal-yellow', color: '#009688', isDark: false }
    click(item);
    fixture.detectChanges();

    expect(component.themeName).toEqual('teal-yellow');
    let ocClasses = component.overlayContainer.getContainerElement().classList;
    expect(ocClasses.contains('teal-yellow')).toBeTruthy();
    expect(ocClasses.contains('indigo-pink')).toBeFalsy();

    expect(component.isInstalled).toBeTruthy();

    expect(hasPrivilegesSpy).toHaveBeenCalled();
    expect(saveThemeSpy).toHaveBeenCalled();

  });

  it('should mouseOver and mouseOut Theme', () => {
    let btnMenu = debugElement.nativeElement.querySelector('#btnMenu');
    click(btnMenu);
    fixture.detectChanges();

    let menuItems: DebugElement[] = Array.from(fixture.debugElement.queryAll(By.css('.mat-menu-item')));
    expect(menuItems.length).toBeGreaterThan(0);
    let item = menuItems[8]; // { name: 'teal-yellow', color: '#009688', isDark: false }
    item.triggerEventHandler('mouseover', null);
    fixture.detectChanges();

    expect(component.themeName).toEqual('teal-yellow');
    let ocClasses = component.overlayContainer.getContainerElement().classList;
    expect(ocClasses.contains('teal-yellow')).toBeTruthy();
    expect(ocClasses.contains('indigo-pink')).toBeFalsy();
    expect(component.isInstalled).toBeFalsy();

    item.triggerEventHandler('mouseout', null);
    fixture.detectChanges();

    expect(component.themeName).toEqual('indigo-pink');
    expect(ocClasses.contains('teal-yellow')).toBeFalsy();
    expect(ocClasses.contains('indigo-pink')).toBeTruthy();
    expect(component.isInstalled).toBeTruthy();

    item.triggerEventHandler('mouseover', null);
    fixture.detectChanges();

    click(item);
    fixture.detectChanges();

    item.triggerEventHandler('mouseout', null);
    fixture.detectChanges();

    expect(component.themeName).toEqual('teal-yellow');
    expect(ocClasses.contains('teal-yellow')).toBeTruthy();
    expect(ocClasses.contains('indigo-pink')).toBeFalsy();

    expect(component.isInstalled).toBeTruthy();


  });


});
