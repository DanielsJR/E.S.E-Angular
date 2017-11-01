import { Component, OnInit } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation  } from '@covalent/core';

@Component({
  selector: 'nx-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],
})
export class TeacherComponent implements OnInit {

  triggerAsignaturas = true;
  triggerMat = true;
  triggerHist = true;

  triggerPruebas = true;

  constructor() { }

  ngOnInit() {
  }

}
