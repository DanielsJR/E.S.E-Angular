import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nx-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit {

  nCards  = [1,2,3,4,5];

  constructor() { }

  ngOnInit() {
  }

}
