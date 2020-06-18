import { Component, OnInit } from '@angular/core';
import { UserLoggedService } from '../services/user-logged.service';



@Component({
  selector: 'nx-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  urlPath;

  constructor(private userLoggedService: UserLoggedService,) {
    this.urlPath = '/home/' + this.userLoggedService.getPrivilege().toLowerCase();
  }

  ngOnInit() {
  }

}
