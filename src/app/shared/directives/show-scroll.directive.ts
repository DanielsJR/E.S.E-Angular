import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[showScroll]',

})
export class ShowScrollDirective {
    private el: HTMLElement;

    @HostListener('mouseenter') onMouseEnter() { this.show(); }
    @HostListener('mouseleave') onMouseLeave() { this.hidden(); }

    constructor(el: ElementRef) { this.el = el.nativeElement; }


    private show() {
        this.el.style.overflow = 'auto';
    }

    private hidden() {
        this.el.style.overflow = 'hidden';
    }

}
