import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherQuizesDetailComponent } from './teacher-quizes-detail.component';

describe('TeacherQuizesDetailComponent', () => {
  let component: TeacherQuizesDetailComponent;
  let fixture: ComponentFixture<TeacherQuizesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherQuizesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherQuizesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
