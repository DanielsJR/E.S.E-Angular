import { Component, OnInit, Input } from '@angular/core';
import { IsLoadingService } from '../../services/isLoadingService.service';

@Component({
  selector: 'nx-login-host',
  templateUrl: './login-host.component.html',
  styleUrls: ['./login-host.component.css']
})
export class LoginHostComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private isLoadingService: IsLoadingService) { }

  ngOnInit() {
    this.isLoadingService.isLoading$.subscribe(result => setTimeout(() => this.isLoading = result));
  }

}
