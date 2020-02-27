import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherQuizesCreateComponent } from './teacher-quizes-create.component';

describe('TeacherQuizesCreateComponent', () => {
  let component: TeacherQuizesCreateComponent;
  let fixture: ComponentFixture<TeacherQuizesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherQuizesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherQuizesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
