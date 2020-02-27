import { Component, OnInit, Input } from '@angular/core';
import {
  tdBounceAnimation,
  tdFlashAnimation,
  tdHeadshakeAnimation,
  tdJelloAnimation,
  tdPulseAnimation,
} from '@covalent/core/common';

@Component({
  selector: 'nx-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
  animations: [
    tdBounceAnimation, // using implicit anchor name 'tdBounce' in template
    tdFlashAnimation, // using implicit anchor name 'tdFlash' in template
    tdHeadshakeAnimation, // using implicit anchor name 'tdHeadshake' in template
    tdJelloAnimation, // using implicit anchor name 'tdJello' in template
    tdPulseAnimation, // using implicit anchor name 'tdPulse' in template

  ],
})


export class LogoComponent implements OnInit {

  @Input() bounceState = false;
  @Input() flashState = false;
  @Input() headshakeState = false;
  @Input() jelloState = false;
  @Input() pulseState = false;
  @Input() type = 'mat-raised-button';

  constructor() { }

  ngOnInit() {
 
  }



}
