import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nx-subject-book',
  templateUrl: './subject-book.component.html',
  styleUrls: ['./subject-book.component.css']
})
export class SubjectBookComponent implements OnInit {

  @Input() areaRole: string;
  
  constructor() { }

  ngOnInit() {
  }

}
