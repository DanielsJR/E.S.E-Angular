import { Component, OnInit, AfterViewInit, ViewChild, Input, OnDestroy } from '@angular/core';


@Component({
  selector: 'nx-subject-grades',
  templateUrl: './subject-grades.component.html',
  styleUrls: ['./subject-grades.component.css']
})
export class SubjectGradesComponent implements OnInit {

@Input() areaRole;
  constructor( ) {

  }

  ngOnInit() {

  }


}
