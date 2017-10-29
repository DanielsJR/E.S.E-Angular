import { Component, OnInit } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation  } from '@covalent/core';


@Component({
  selector: 'nx-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],
})

export class MainContentComponent implements OnInit {

  triggerAsignaturas = true;
  triggerMat = true;
  triggerHist = true;

  triggerPruebas = true;

  constructor() { }

  ngOnInit() {
  }

}
