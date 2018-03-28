import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerGetStudentsComponent } from './manager-get-students.component';

describe('ManagerGetStudentsComponent', () => {
  let component: ManagerGetStudentsComponent;
  let fixture: ComponentFixture<ManagerGetStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerGetStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerGetStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
