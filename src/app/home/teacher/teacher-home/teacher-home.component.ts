import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nx-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrls: ['./teacher-home.component.css']
})
export class TeacherHomeComponent implements OnInit {

  nCards = [1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {
  }

}
