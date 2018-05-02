import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUserDialogRefComponent } from './image-user-dialog-ref.component';

describe('ImageUserDialogRefComponent', () => {
  let component: ImageUserDialogRefComponent;
  let fixture: ComponentFixture<ImageUserDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUserDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUserDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
