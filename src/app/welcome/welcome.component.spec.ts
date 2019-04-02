import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WelcomeModule } from './welcome.module';
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
  
    let themePickerDebugElement = fixture.debugElement.query(By.css('nx-theme-picker'));
    let themePicker : ThemePickerComponent = themePickerDebugElement.componentInstance;
    let darkTheme:Theme = { name: 'deeppurple-amber-dark', color: '#673AB7', isDark: true };
    themePicker.installTheme(darkTheme);  
    fixture.detectChanges();
         
    expect(themePicker.themeName).toEqual('deeppurple-amber-dark');
    expect(themePicker.isDark).toBeTruthy();

    expect(matSidenavContainer.className).toEqual('deeppurple-amber-dark');
    let expectedMatCardColor = 'rgb(46, 46, 46)';
    expect(matCard.style.backgroundColor).toEqual(expectedMatCardColor);
        
  });


});
