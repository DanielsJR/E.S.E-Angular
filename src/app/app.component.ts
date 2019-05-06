import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'nx-app',
  template: `
  <router-outlet></router-outlet>
   
  `,
  styles: [
    `
    .p-bar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3;
  }

    `
  ]
})

export class AppComponent implements OnInit {
  isLoading: boolean;

  // Diagnostic only: inspect router configuration
  constructor() {
    // console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }

  ngOnInit() {

  }

}