import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'nx-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.css']
})
export class FullScreenComponent implements OnInit {

  isFullscreen = false;
  tooltipMessage = 'Pantalla Completa';

  constructor( @Inject(DOCUMENT) private doc: any) { }

  ngOnInit() {

  }

  toggleFullScreen() {
    const docEl = this.doc.documentElement;

    // tslint:disable-next-line:max-line-length
    const requestFullScreen = docEl['requestFullscreen'] || docEl['mozRequestFullScreen'] || docEl['webkitRequestFullScreen'] || docEl['msRequestFullscreen'];
    const cancelFullScreen = this.doc['exitFullscreen'] || this.doc['mozCancelFullScreen'] || this.doc['webkitExitFullscreen'] || this.doc['msExitFullscreen'];

    // tslint:disable-next-line:max-line-length
    if (!this.doc['fullscreenElement'] && !this.doc['mozFullScreenElement'] && !this.doc['webkitFullscreenElement'] && !this.doc['msFullscreenElement']) {
      requestFullScreen.call(docEl);
      this.tooltipMessage = 'Salir Pantalla Completa';
      this.isFullscreen = true;
    } else {
      cancelFullScreen.call(this.doc);
      this.tooltipMessage = 'Pantalla Completa';
      this.isFullscreen = false;
    }
  }

}
