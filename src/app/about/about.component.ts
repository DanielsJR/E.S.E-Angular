import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nx-about',
  template: `
<button (click)="byEmail=true">By Email</button>
<button (click)="byEmail=false">By Social</button>

<div *ngIf="byEmail; then emailTemplate; else socialTemplate"></div>

<ng-template #emailTemplate>
  <a href="">Contact by Email</a>
</ng-template>

<ng-template #socialTemplate>
  <a href="">Contact by Social</a>
</ng-template>

  `,
  styles: []
})
export class AboutComponent implements OnInit {

byEmail = false;

  constructor() { }

  ngOnInit() {
  }

}
