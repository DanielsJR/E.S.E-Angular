import { Component, OnInit,} from '@angular/core';

@Component({
  template: `
  <nx-get-users [uriRole] ="'/students'" [areaRole] ="'MANAGER'"></nx-get-users>
  `,
  styles: ['']
})

export class ManagerGetStudentsComponent implements OnInit {

 constructor() { }

ngOnInit() { }
  
}