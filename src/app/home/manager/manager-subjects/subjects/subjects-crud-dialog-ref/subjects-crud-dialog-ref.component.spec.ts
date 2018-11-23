import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectsCrudDialogRefComponent } from './subjects-crud-dialog-ref.component';



describe('ManagerSubjectsCrudDialogComponent', () => {
  let component: SubjectsCrudDialogRefComponent;
  let fixture: ComponentFixture<SubjectsCrudDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectsCrudDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsCrudDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
