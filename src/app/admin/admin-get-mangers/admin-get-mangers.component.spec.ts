import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGetMangersComponent } from './admin-get-mangers.component';

describe('AdminGetMangersComponent', () => {
  let component: AdminGetMangersComponent;
  let fixture: ComponentFixture<AdminGetMangersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGetMangersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGetMangersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
