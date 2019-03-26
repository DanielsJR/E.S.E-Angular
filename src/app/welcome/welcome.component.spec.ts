import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../shared/shared.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../login/login-form/login.service';
import { WelcomeModule } from './welcome.module';
import { MatCard } from '@angular/material';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { Theme } from '../shared/theme-picker/theme';
import { By } from '@angular/platform-browser';
import { httpStub, routerStub } from '../testing/stubs';


describe('Welcome Component', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        WelcomeModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: HttpClient, useValue: httpStub },
        { provide: Router, useValue: routerStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current year', () => {
    let currentYear = new Date().getFullYear();
    expect(component.year).toEqual(currentYear);
  });

  it('should display theme properly', () => {
    let matCard = fixture.nativeElement.querySelector('#center') as HTMLElement;
    let matSidenavContainer = fixture.nativeElement.querySelector('mat-sidenav-container') as HTMLElement;
    let themeDebugElement = fixture.debugElement.query(By.css('nx-theme-picker'));
    let theme : ThemePickerComponent = themeDebugElement.componentInstance;

    let darkTheme:Theme = { name: 'deeppurple-amber-dark', color: '#673AB7', isDark: true };
    theme.installTheme(darkTheme);
    fixture.detectChanges();
    let matCardColor = matCard.style.backgroundColor;
    let matSidenavContainerClass = matSidenavContainer.className;
    let expectedMatCardColor = 'rgb(46, 46, 46)';
      
    expect(theme.themeName).toEqual('deeppurple-amber-dark');
    expect(theme.isDark).toBeTruthy();
    expect(matSidenavContainerClass).toEqual(theme.themeName);
    expect(expectedMatCardColor).toEqual(matCardColor);
  });


});
