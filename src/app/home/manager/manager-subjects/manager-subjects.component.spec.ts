import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerSubjectsComponent } from './manager-subjects.component';

describe('ManagerSubjectsComponent', () => {
  let component: ManagerSubjectsComponent;
  let fixture: ComponentFixture<ManagerSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
