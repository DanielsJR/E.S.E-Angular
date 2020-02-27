import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudUserDialogRefComponent } from './crud-user-dialog-ref.component';
import { UsersModule } from '../../users.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../../../../testing/stubs';
import { studentTest } from '../../../../testing/models';
import { URI_STUDENTS, ROLE_TEACHER } from '../../../../app.config';

describe('CrudUserDialogRefComponent', () => {
    let component: CrudUserDialogRefComponent;
    let fixture: ComponentFixture<CrudUserDialogRefComponent>;

    let data = {
        user: studentTest,
        uriRole: URI_STUDENTS,
        type: 'detail',
        areaRole: ROLE_TEACHER,
        onlyRead: true,

    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [UsersModule, BrowserAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: CrudUserDialogRefComponent },
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: HttpClient, useValue: httpStub },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrudUserDialogRefComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });



});
