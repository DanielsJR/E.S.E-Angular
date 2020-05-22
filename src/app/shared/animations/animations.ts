import { trigger, state, style, transition, animate, animateChild, query, group, keyframes, useAnimation } from '@angular/animations';
import { rotateCubeToLeft, moveFromTop, rotateCubeToRight, rotateCubeToBottom, rotateCubeToTop, moveFromLeftFade, moveFromRightFade, moveFromTopFade, moveFromBottomFade, moveFromLeft, moveFromRight, moveFromBottom, slide, fromLeftEasing, fromRightEasing, fromBottomEasing, fromTopEasing, scaleDownFromLeft, scaleDownFromRight, scaleDownFromBottom, scaleDownFromTop, rotateSides, rotateGlueFromRight, rotateGlueFromLeft, rotateGlueFromBottom, rotateGlueFromTop, rotateFlipToLeft, rotateFlipToBottom, rotateFlipToTop, rotateFlipToRight, rotateRoomToLeft, rotateRoomToRight, rotateRoomToBottom, rotateRoomToTop, rotateCarouselToLeft, rotateCarouselToRight, rotateCarouselToBottom, rotateCarouselToTop } from "ngx-router-animations";



export const adminRouteAnimations = trigger('adminRouteAnimations', [
  transition('* => *', useAnimation(slide)),
]);
export const managerRouteAnimations = trigger('managerRouteAnimations', [

  /* transition('* =>  manager-home', [
     query(':enter, :leave', [
       style({
         position: 'absolute',
         left: 0,
         width: '100%',
       }),
     ]),
     group([
       query(':enter', [
         animate('2000ms ease', keyframes([
           style({ transform: 'scale(0) translateX(100%)', offset: 0 }),
           style({ transform: 'scale(0.5) translateX(25%)', offset: 0.3 }),
           style({ transform: 'scale(1) translateX(0%)', offset: 1 }),
         ])),
       ]),
       query(':leave', [
         animate('2000ms ease', keyframes([
           style({ transform: 'scale(1)', offset: 0 }),
           style({ transform: 'scale(0.5) translateX(-25%) rotate(0)', offset: 0.35 }),
           style({ opacity: 0, transform: 'translateX(-50%) rotate(-180deg) scale(6)', offset: 1 }),
         ])),
       ], { optional: true })
     ]),
   ]),*/



  transition('manager-home => teachers', useAnimation(rotateCarouselToTop)),
  transition('manager-home => students', useAnimation(rotateCarouselToTop)),
  transition('manager-home => courses', useAnimation(rotateCarouselToTop)),
  transition('manager-home => subjects', useAnimation(rotateCarouselToTop)),
  transition('manager-home => courses', useAnimation(rotateCarouselToTop)),
  transition('manager-home => courses-create', useAnimation(rotateCarouselToTop)),

  transition('teachers => manager-home', useAnimation(rotateCarouselToBottom)),
  transition('teachers => students', useAnimation(rotateCarouselToLeft)),
  transition('teachers => courses', useAnimation(rotateCarouselToTop)),
  transition('teachers => subjects', useAnimation(rotateCarouselToTop)),
  transition('teachers => courses-create', useAnimation(rotateCarouselToTop)),
  transition('teachers => courses-name', useAnimation(rotateCarouselToTop)),

  transition('students => manager-home', useAnimation(rotateCarouselToBottom)),
  transition('students => teachers', useAnimation(rotateCarouselToRight)),
  transition('students => courses', useAnimation(rotateCarouselToTop)),
  transition('students => subjects', useAnimation(rotateCarouselToTop)),
  transition('students => courses-create', useAnimation(rotateCarouselToTop)),
  transition('students => courses-name', useAnimation(rotateCarouselToTop)),

  transition('courses => manager-home', useAnimation(rotateCarouselToBottom)),
  transition('courses => teachers', useAnimation(rotateCarouselToBottom)),
  transition('courses => students', useAnimation(rotateCarouselToBottom)),
  transition('courses => subjects', useAnimation(rotateCarouselToTop)),
  transition('courses => courses-create', useAnimation(scaleDownFromLeft)),
  transition('courses => courses-name', useAnimation(scaleDownFromLeft)),

  transition('courses-create => manager-home', useAnimation(rotateCarouselToBottom)),
  transition('courses-create => courses', useAnimation(scaleDownFromRight)),
  transition('courses-create => teachers', useAnimation(rotateCarouselToBottom)),
  transition('courses-create => students', useAnimation(rotateCarouselToBottom)),
  transition('courses-create => subjects', useAnimation(rotateCarouselToTop)),

  transition('courses-name => manager-home', useAnimation(rotateCarouselToBottom)),
  transition('courses-name => courses', useAnimation(scaleDownFromRight)),
  transition('courses-name => teachers', useAnimation(rotateCarouselToBottom)),
  transition('courses-name => students', useAnimation(rotateCarouselToBottom)),
  transition('courses-name => subjects', useAnimation(rotateCarouselToTop)),

  transition('subjects => manager-home', useAnimation(rotateCarouselToBottom)),
  transition('subjects => teachers', useAnimation(rotateCarouselToBottom)),
  transition('subjects => students', useAnimation(rotateCarouselToBottom)),
  transition('subjects => courses', useAnimation(rotateCarouselToBottom)),
  transition('subjects => courses-create', useAnimation(rotateCarouselToBottom)),
  transition('subjects => courses-name', useAnimation(rotateCarouselToBottom)),

  transition('* => *', useAnimation(slide)),

]);

export const subjectRouteAnimations = trigger('subjectRouteAnimations', [

  transition('course-id => evaluations-id', useAnimation(rotateCarouselToLeft)),
  transition('course-id => attendance-id', useAnimation(rotateCarouselToLeft)),
  transition('course-id => grades-id', useAnimation(scaleDownFromLeft)),
  transition('grades-id => course-id', useAnimation(scaleDownFromRight)),

  transition('evaluations-id => course-id', useAnimation(rotateCarouselToRight)),
  transition('evaluations-id => attendance-id', useAnimation(rotateCarouselToLeft)),

  transition('attendance-id => course-id', useAnimation(rotateCarouselToRight)),
  transition('attendance-id => evaluations-id', useAnimation(rotateCarouselToRight)),

  
  //transition('* => course-id , * => evaluations-id , * => attendance-id', useAnimation(slide)),
  //transition('course-id => * , evaluations-id => * , attendance-id => *', useAnimation(slide)),
  transition('* <=> *', useAnimation(slide)),

  //waits 1000ms 
   //transition('* <=> *', [query(':enter, :leave', [animate('1000ms'),], { optional: true }),]),
   /*transition('* => course-id , * => evaluations-id , * => attendance-id', [
    query(':enter', [animate('1000ms'),], { optional: true }),
  ]),

  transition('course-id => * , attendance-id => * , evaluations-id => *', [
    query(':leave', [animate('1000ms')], { optional: true }),
  ]), */

]);


export const onSideNavChange = trigger('onSideNavChange', [
  state('close',
    style({
      'width': '65px'
    })
  ),
  state('open',
    style({
      'width': '351px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export const onMainContentChangeLeft = trigger('onMainContentChangeLeft', [
  state('close',
    style({
      'margin-left': '65px'
    })
  ),
  state('open',
    style({
      'margin-left': '351px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export const onMainContentChangeRight = trigger('onMainContentChangeRight', [
  state('close',
    style({
      'margin-right': '65px'
    })
  ),
  state('open',
    style({
      'margin-right': '351px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export const animateText = trigger('animateText', [
  state('hide',
    style({
      'display': 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      'display': 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);

export const onLogoChange = trigger('onLogoChange', [
  state('close',
    style({
      'margin-left': '8px'
    })
  ),
  state('open',
    style({
      'margin-left': '155px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export const fadeAnimation = trigger('fadeAnimation', [

  transition('* => *', [

    query(':enter',
      [
        style({ opacity: 0 })
      ],
      { optional: true }
    ),

    query(':leave',
      [
        style({ opacity: 1 }),
        animate('0.5s', style({ opacity: 0 }))
      ],
      { optional: true }
    ),

    query(':enter',
      [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 }))
      ],
      { optional: true }
    )

  ])

]);


//fixes mat-table animations
export const rowAnimation = trigger('rowAnimation', [transition('* => void', [animate('0ms', style({ display: 'none' }))])]);






