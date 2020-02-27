import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'nx-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  @Input()
  user: User;

  constructor() { }

  ngOnInit() {
  }

}
