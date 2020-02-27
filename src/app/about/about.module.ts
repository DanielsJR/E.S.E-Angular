import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  }

];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],

  declarations: [
    AboutComponent
  ]
})

export class AboutModule { }
