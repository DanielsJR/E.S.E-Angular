import { PeopleDatabase } from './table/people-database';

import { TableHeaderDemo } from './table/table-header-demo';
import { TableDemo } from './table/table-demo';
import { TableHttpExample } from './table-http/table-http-example';
import { SharedModule } from '../shared/shared.module';
import { SocialComponent } from './social.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: SocialComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],

  declarations: [
    SocialComponent,
    TableHttpExample,
    TableDemo,
    TableHeaderDemo

  ],
  providers: [PeopleDatabase]
})

export class SocialModule { }
