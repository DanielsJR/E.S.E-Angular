import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'nx-app',
  template: `<router-outlet></router-outlet>`,
  styles: []
})

export class AppComponent implements OnInit {

  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    // console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }

  ngOnInit() { }

}