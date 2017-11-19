import { Component, OnInit } from '@angular/core';
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

  bounceState = false;
  flashState = false;
  headshakeState = false;
  jelloState = false;
  pulseState = false;

  anim;

  anims = [

    {
      name: 'tdBounce',
      active: false,
    },
    {
      name: 'tdFlash',
      active: false,
    },
    {
      name: 'tdHeadshake',
      active: false,
    },
    {
      name: 'tdJello',
      active: false,
    },
    {
      name: 'tdPulse',
      active: false,
    },
  ];



  constructor() { }

  ngOnInit() {
    this.animate();
  }

  animate(): void {
    this.anim = this.anims[Math.floor(Math.random() * this.anims.length)];
    this.anim.active = true;
    console.log(this.anim.name + ' ' + this.anim.active);

  }



}
