import { Component, OnInit } from '@angular/core';
import { ROLE_MANAGER } from '../../../../app.config';


@Component({
  template: `<nx-subject-detail [areaRole] = "areaRole"></nx-subject-detail>`,
  styles: [`:host  {
    display: block;
    width: 100%;
  }
  `]
})
export class ManagerSubjectsDetailComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
