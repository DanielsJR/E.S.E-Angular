import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ScrollerDirective } from "./scroll.directive";
import { By } from "@angular/platform-browser";
import { newEvent } from "../../testing/helper-utilities";

describe('ScrollerDirective', () => {

    let fixture: ComponentFixture<TestComponent>;
    let des: DebugElement[];

    let comp: TestComponent;
    let h1s: DebugElement[];

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [ScrollerDirective, TestComponent]
        })
            .createComponent(TestComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges(); // initial binding


        // all elements with an attached HighlightDirective
        des = fixture.debugElement.queryAll(By.directive(ScrollerDirective));
        h1s = fixture.debugElement.queryAll(By.css('h1'));

    });

    it('should have 1 element', () => {
        expect(des.length).toBe(1);
        expect(h1s.length).toBe(10);
    });


    // TODO, doesn't work :(
    xit('should tell if is scrolled', () => {
        expect(comp.isScrolled).toBeFalsy('is scrolled false');
        let divD = des[0];
        let divE = divD.nativeElement as HTMLDivElement;
        divE.style.overflow = 'auto';
        //div.nativeElement.style.height = '5000px';

        /*  div.scrollTop = 50;
          fixture.detectChanges();
          expect(comp.isScrolled).toBeFalsy('50px should be false'); */

        fixture.detectChanges();
        divE.scrollTo(0,70);
        fixture.detectChanges();
        divD.triggerEventHandler('scroll', null);

        //div.nativeElement.dispatchEvent(newEvent('scroll'));
        fixture.detectChanges();
        expect(comp.isScrolled).toBeTruthy('75px should be true');

        /*  div.scrollTop = 3;
          fixture.detectChanges();
          expect(comp.isScrolled).toBeFalsy('3px should be false'); */
    });

});

@Component({
    template: `
    <div (nxScroller) = "isScrolled=$event">
      <h1 *ngFor = "let n of array">h1</h1>
    </div>
   `
})
class TestComponent {
    isScrolled = false;
    array = [];
    constructor() {
        for (let i: number = 1; i < 10; i++) {
            this.array[i] = i;
        }
    }
}