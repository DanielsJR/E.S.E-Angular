import { Component, OnInit } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation  } from '@covalent/core';

@Component({
  selector: 'nx-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],
})
export class AdminComponent implements OnInit {

  triggerAsignaturas = true;
  triggerMat = true;
  triggerHist = true;

  triggerPruebas = true;

  constructor() { }

  ngOnInit() {
  }

}
