import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../shared/shared.module";
import { GetUsersModule } from "../../../get-users/get-users.module";

import { SubjectsCrudDialogRefComponent } from "./subjects-crud-dialog-ref/subjects-crud-dialog-ref.component";
import { SubjectGradesComponent } from "./subject-grades/subject-grades.component";
import { SubjectsComponent } from "./subjects.component";
import { SubjectDetailComponent } from "./subject-detail/subject-detail.component";
import { SubjectsRoutingModule } from "./subjects.routing";


@NgModule({
  imports: [
    SharedModule,
    GetUsersModule,
    SubjectsRoutingModule,
 
  ],

  declarations: [
    SubjectsComponent,
    SubjectsCrudDialogRefComponent,
    SubjectDetailComponent,
    SubjectGradesComponent,
  ],

  providers: [

  ],

  entryComponents: [
   SubjectsCrudDialogRefComponent,
  ],

  exports:[
    SubjectsComponent,
    SubjectDetailComponent,
    SubjectGradesComponent,
  ]

})
export class SubjectsModule { }