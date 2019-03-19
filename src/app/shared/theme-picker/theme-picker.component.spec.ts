import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemePickerComponent } from './theme-picker.component';
import { ThemePickerModule } from './theme-picker.module';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../../testing/stubs';

describe('Theme Picker Component', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ThemePickerModule],
      providers: [
        { provide: HttpClient, useValue: httpStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

});
