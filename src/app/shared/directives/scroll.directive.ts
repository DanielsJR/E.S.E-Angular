import { Directive, HostListener, Output, ElementRef, EventEmitter } from '@angular/core';

@Directive({
    selector: '[nxScroller]'
})
export class ScrollerDirective {

    scrolled = false;
    @Output('nxScroller') public scrollEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    @HostListener('scroll') onScroll() {
        const nPixels = this.el.nativeElement.scrollTop || 0;
        if (nPixels > 64) {
            this.scrollEvent.emit(this.scrolled = true);
           // console.log('true');
        } else if (this.scrolled && nPixels < 10) {
            this.scrollEvent.emit(this.scrolled = false);
           // console.log('false');
        }

    }

    constructor(private el: ElementRef) { }


}
