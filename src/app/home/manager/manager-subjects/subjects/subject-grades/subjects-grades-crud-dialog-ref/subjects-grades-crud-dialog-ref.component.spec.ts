import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectsGradesCrudDialogRefComponent } from './subjects-grades-crud-dialog-ref.component';




describe('ManagerSubjectsCrudDialogComponent', () => {
  let component: SubjectsGradesCrudDialogRefComponent;
  let fixture: ComponentFixture<SubjectsGradesCrudDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectsGradesCrudDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsGradesCrudDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
