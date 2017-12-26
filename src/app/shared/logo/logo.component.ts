import { Component, OnInit, Input } from '@angular/core';
import {
  TdBounceAnimation,
  TdFlashAnimation,
  TdHeadshakeAnimation,
  TdJelloAnimation,
  TdPulseAnimation,
} from '@covalent/core';

@Component({
  selector: 'nx-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
  animations: [
    TdBounceAnimation(), // using implicit anchor name 'tdBounce' in template
    TdFlashAnimation(), // using implicit anchor name 'tdFlash' in template
    TdHeadshakeAnimation(), // using implicit anchor name 'tdHeadshake' in template
    TdJelloAnimation(), // using implicit anchor name 'tdJello' in template
    TdPulseAnimation(), // using implicit anchor name 'tdPulse' in template

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
