import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],

  declarations: [
    HomeComponent
  ]
})

export class HomeModule { }
