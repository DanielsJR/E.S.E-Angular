import { Component, OnInit, Inject, OnDestroy, Input } from '@angular/core';


@Component({
  selector: 'nx-subjects-grades-crud-dialog-ref',
  templateUrl: './subjects-grades-crud-dialog-ref.component.html',
  styleUrls: ['./subjects-grades-crud-dialog-ref.component.css']
})
export class SubjectsGradesCrudDialogRefComponent implements OnInit {

  @Input() areaRole;
  constructor() {}

   
  ngOnInit() {

  }

 }
