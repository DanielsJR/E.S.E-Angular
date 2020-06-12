import { Router, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { mainRouteAnimations } from './shared/animations/animations';


@Component({
  selector: 'nx-app',
  template: `

     <div class="animWrapper" [@mainRouteAnimations]= "getState(o)">
         <div class="routerWrapper">
             <router-outlet #o="outlet" id="mainOutlet"></router-outlet>
         </div>
     </div>
 `,

  styles: [`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  .animWrapper {
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 1200px;
    transform-style: preserve-3d;
    overflow: hidden;
  }
  
  .routerWrapper {
    height: 100%;
    overflow-x: hidden;
  }

  `],

  animations: [mainRouteAnimations]
})

export class AppComponent {

  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    //console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }

  getState(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }


}