import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from './services/isLoadingService.service';


@Component({
  selector: 'nx-app',
  template: `
  <router-outlet></router-outlet>
  <div *ngIf="!isLoading" style="height: 5px;" class="p-bar"></div>
  <mat-progress-bar *ngIf="isLoading" mode="indeterminate" color="accent" class="p-bar"></mat-progress-bar>
  
  
  `,
  styles: [
    `
    .p-bar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3;
  }

    `
  ]
})

export class AppComponent implements OnInit {
  isLoading: boolean;

  // Diagnostic only: inspect router configuration
  constructor(router: Router, private isLoadingService: IsLoadingService) {
    // console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }

  ngOnInit() {
    this.isLoadingService.isLoading$.subscribe(result => setTimeout(() => this.isLoading = result));
  }

}