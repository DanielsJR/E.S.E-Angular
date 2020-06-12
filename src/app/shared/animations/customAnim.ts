import { animation, query, group, style, animate, keyframes } from '@angular/animations';


//keyframes
export const scaleDownKeyframes = keyframes([
    style({ opacity: '1', transform: 'scale(1)', offset: 0 }),
    style({ opacity: '0', transform: 'scale(0.8)', offset: 1 })
  ]);
  
  export const moveFromLeftKeyframes = keyframes([
    style({ transform: 'translateX(-100%)', offset: 0, 'z-index': '9999' }),
    style({ transform: 'translateX(0%)', offset: 1 })
  ]);
  
  export const moveFromRightKeyframes = keyframes([
    style({ transform: 'translateX(100%)', offset: 0, 'z-index': '9999' }),
    style({ transform: 'translateX(0%)', offset: 1 })
  ]);
  
  
  //styles
  export const sharedStyles = {
    position: 'fixed',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
  };




