import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserDialogRefComponent } from './search-user-dialog-ref.component';

describe('SearchUserDialogRefComponent', () => {
  let component: SearchUserDialogRefComponent;
  let fixture: ComponentFixture<SearchUserDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUserDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
