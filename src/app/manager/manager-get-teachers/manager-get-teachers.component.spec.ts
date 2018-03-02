import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerGetTeachersComponent } from './manager-get-teachers.component';

describe('ManagerGetTeachersComponent', () => {
  let component: ManagerGetTeachersComponent;
  let fixture: ComponentFixture<ManagerGetTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerGetTeachersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerGetTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
