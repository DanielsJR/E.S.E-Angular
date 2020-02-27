import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nx-about',
  template: `
<h1>about works!</h1> 
  `,
  styles: []
})
export class AboutComponent implements OnInit {

byEmail = false;

  constructor() { }

  ngOnInit() {
  }

}
