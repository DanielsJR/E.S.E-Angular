import { Component, OnInit,} from '@angular/core';

@Component({
  template: `
  <nx-get-users [uriRole] ="'/teachers'"></nx-get-users>
  `,
  styles: ['']
})

export class ManagerGetTeachersComponent implements OnInit {

 constructor() { }

ngOnInit() { }
  
}
