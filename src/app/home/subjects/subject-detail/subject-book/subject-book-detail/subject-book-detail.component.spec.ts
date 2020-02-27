import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectBookDetailComponent } from './subject-book-detail.component';

describe('SubjectBookDetailComponent', () => {
  let component: SubjectBookDetailComponent;
  let fixture: ComponentFixture<SubjectBookDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectBookDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectBookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
