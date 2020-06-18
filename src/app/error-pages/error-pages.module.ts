import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PageNotFoundComponent,
    data: { animation: 'not-found' },
  }

];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),

  ],

  declarations: [
    PageNotFoundComponent,

  ],


})

export class ErrorPagesModule { }
