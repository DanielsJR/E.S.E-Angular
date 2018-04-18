import { Directive, ElementRef, Input, ViewChildren, QueryList, ViewChild } from "@angular/core";

// TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
@Directive({
    selector: '[nxFixBtnFocus]'
})
export class FixBtnFocusDirective {

    //@ViewChildren("button") query: QueryList<ElementRef>;
    @Input()
    button: ElementRef;
    @Input()
    id: ElementRef;
    //@ViewChild("button") button: QueryList<ElementRef>;

    constructor(private el: ElementRef) { }

    fixButtonFocus(button: any) {
        button._elementRef.nativeElement.classList.remove("cdk-program-focused");
        button._elementRef.nativeElement.classList.add("cdk-mouse-focused");
    }

}