import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: AdminComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }
