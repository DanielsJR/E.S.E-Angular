import {OverlayContainer} from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';

@NgModule({
  // ...
})
export class ThemeModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('');
  }
}
