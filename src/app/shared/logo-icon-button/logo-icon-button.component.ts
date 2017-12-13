import { Component, OnInit } from '@angular/core';
import {
  TdBounceAnimation,
  TdFlashAnimation,
  TdHeadshakeAnimation,
  TdJelloAnimation,
  TdPulseAnimation,
} from '@covalent/core';

@Component({
  selector: 'nx-logo-icon-button',
  templateUrl: './logo-icon-button.component.html',
  styleUrls: ['./logo-icon-button.component.css'],
  animations: [
    TdBounceAnimation(), // using implicit anchor name 'tdBounce' in template
    TdFlashAnimation(), // using implicit anchor name 'tdFlash' in template
    TdHeadshakeAnimation(), // using implicit anchor name 'tdHeadshake' in template
    TdJelloAnimation(), // using implicit anchor name 'tdJello' in template
    TdPulseAnimation(), // using implicit anchor name 'tdPulse' in template
  ],
})
export class LogoIconButtonComponent implements OnInit {

  bounceState = false;
  flashState = false;
  headshakeState = false;
  jelloState = false;
  pulseState = false;

  constructor() { }

  ngOnInit() {
  }

}