import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nx-subject-quiz',
  templateUrl: './subject-quiz.component.html',
  styleUrls: ['./subject-quiz.component.css']
})
export class SubjectQuizComponent implements OnInit{

  
  @Input() areaRole;
  constructor( ) { }

  ngOnInit() {

  }
  

}
