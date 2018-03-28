import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerGetTeachersDialogRefComponent } from './manager-get-teachers-dialog-ref.component';



describe('ManagerDialogRefComponent', () => {
  let component: ManagerGetTeachersDialogRefComponent;
  let fixture: ComponentFixture<ManagerGetTeachersDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerGetTeachersDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerGetTeachersDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
