import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SafePipe } from './safe.pipe';
import { RolesToSpanishPipe } from './roles-to-spanish.pipe';
import { ShortNameLastnamePipe } from './short-name-lastname.pipe';
import { ShortNamePipe } from './short-name.pipe';



@NgModule({
    imports: [
        CommonModule,

    ],

    declarations: [
        SafePipe,
        RolesToSpanishPipe,
        ShortNameLastnamePipe,
        ShortNamePipe,
    ],

    exports: [
        SafePipe,
        RolesToSpanishPipe,
        ShortNameLastnamePipe,
        ShortNamePipe,
    ]
})
export class PipeModule { }