import { Directive, ElementRef, Input, OnInit, HostListener } from '@angular/core';


@Directive({
    selector: '[nxColorGrade]',
})
export class ColorGradeDirective implements OnInit {

    private _grade: number;
    @Input() set grade(grade: number) {
        this._grade = grade;
        this.setColor(this.grade, this.isDark);
    }

    private _isDark: boolean;
    @Input() set isDark(value: boolean) {
        this._isDark = value;
        this.setColor(this.grade, this.isDark);
    }

    get grade() {
        return this._grade;
    }

    get isDark() {
        return this._isDark;
    }

    constructor(private el: ElementRef) {
        this.el.nativeElement.style.fontSize = 'larger';
        this.el.nativeElement.style.fontWeight =  '500';
    }

    ngOnInit(): void {
        this.setColor(this.grade, this.isDark);
    }

    setColor(grade: number, isDark: boolean) {
        if (grade >= 4.0) {
            this.el.nativeElement.style.color = 'blue';
            if (isDark) {
                this.el.nativeElement.style.color = 'skyblue';
            }
        } else {
            this.el.nativeElement.style.color = 'red';
            if (isDark) {
                this.el.nativeElement.style.color = 'tomato';
            }
        }
    }

    @HostListener('input')
    onChange() {
        this.setColor(Number(this.el.nativeElement.value), this.isDark);
    }



}
