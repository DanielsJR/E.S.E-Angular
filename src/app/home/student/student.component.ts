import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class StudentComponent implements OnInit, OnDestroy {

    ngOnInit(){
        console.log("StudentComponent ngOnInit() called!!!");
    }

    ngOnDestroy() {
        console.log("StudentnComponent ngOnDestroy() called!!!");
    }
 }