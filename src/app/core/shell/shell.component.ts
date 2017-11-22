import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'nx-shell',
  template: `<nx-main-content></nx-main-content>`,
  styles: []
})

export class ShellComponent implements OnInit {

  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }

  ngOnInit() { }



}
