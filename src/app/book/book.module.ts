import { BookChildComponent } from './book-child.component';

import { DialogOverviewBookDialogComponent } from './dialog/dialog-overview-dialog.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import {
  CarouselModule,
  ButtonModule,
  GrowlModule,
  TabViewModule,
  CodeHighlighterModule
} from 'primeng/primeng';
import { DialogOverviewBookComponent} from './dialog/dialog.component';


@NgModule({
  imports: [
    SharedModule,
    BookRoutingModule,
    ButtonModule,
    GrowlModule,
    CarouselModule,
    TabViewModule,
    CodeHighlighterModule
  ],

  declarations: [
    BookComponent,
    DialogOverviewBookComponent,
    DialogOverviewBookDialogComponent,
    BookChildComponent

  ],
  entryComponents: [
    DialogOverviewBookDialogComponent
  ],
})

export class BookModule { }
