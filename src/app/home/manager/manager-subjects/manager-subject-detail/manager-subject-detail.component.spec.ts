import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerSubjectDetailComponent } from './manager-subject-detail.component';

describe('ManagerSubjectDetailComponent', () => {
  let component: ManagerSubjectDetailComponent;
  let fixture: ComponentFixture<ManagerSubjectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSubjectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerSubjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
