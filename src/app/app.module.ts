import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { ShellComponent } from './core/shell/shell.component';



@NgModule({

  imports: [
    // BrowserModule,
    BrowserAnimationsModule,
    CoreModule
  ],

  bootstrap: [
    ShellComponent
  ],

  declarations: []
})

export class AppModule { }
