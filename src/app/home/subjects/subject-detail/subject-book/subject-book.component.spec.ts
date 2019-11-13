import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectBookComponent } from './subject-book.component';

describe('SubjectBookComponent', () => {
  let component: SubjectBookComponent;
  let fixture: ComponentFixture<SubjectBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
