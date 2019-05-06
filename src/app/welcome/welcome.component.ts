import { Component, OnInit } from '@angular/core';
import { Theme } from '../shared/theme-picker/theme';
import { IsLoadingService } from '../services/isLoadingService.service';


@Component({
  selector: 'nx-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isLoading: boolean = false;
  initialTheme: Theme;
  
  constructor(private isLoadingService: IsLoadingService) { }

  ngOnInit() {
    this.isLoadingService.isLoading$.subscribe(result => setTimeout(() => this.isLoading = result));

  }

  get year() {
    return new Date().getFullYear();
  }

}
