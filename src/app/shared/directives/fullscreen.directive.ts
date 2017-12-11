import { Directive, HostListener, Inject, Output, ElementRef, EventEmitter } from '@angular/core';

@Directive({
    selector: '[nxFullscreen]'
})
export class FullscreenDirective {

    ESCAPE_KEYCODE = 122;
    fullscreen = false;
    @Output() public fullscreenEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

   @HostListener('keydown') keydown() {
      //  const keyPress = this.el.nativeElement.onkeypress;
        const code = this.el.nativeElement.keyCode || this.el.nativeElement.which;
         if (code === 122) {
            this.fullscreenEvent.emit(this.fullscreen = true);
            console.log('fullscreen true');
        } else  {
            this.fullscreenEvent.emit(this.fullscreen = false);
            console.log('fullscreen false');
        }

    }  
   
    constructor(private el: ElementRef) { }


}
