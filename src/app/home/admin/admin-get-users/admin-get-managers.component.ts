
import { Component, OnInit,} from '@angular/core';

@Component({
  template: `
  <nx-get-users [uriRole] ="'/managers'"></nx-get-users>
  `,
  styles: ['']
})

export class AdminGetManagersComponent implements OnInit{

  constructor() { }

  ngOnInit() { }
    
}


