import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerSubjectsCrudDialogRefComponent } from './manager-subjects-crud-dialog-ref.component';



describe('ManagerSubjectsCrudDialogComponent', () => {
  let component: ManagerSubjectsCrudDialogRefComponent;
  let fixture: ComponentFixture<ManagerSubjectsCrudDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSubjectsCrudDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerSubjectsCrudDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
