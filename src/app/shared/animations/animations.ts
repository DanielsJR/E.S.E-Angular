import { trigger, state, style, transition, animate, animateChild, query, group, keyframes, useAnimation } from '@angular/animations';
import { rotateCubeToLeft, moveFromTop, rotateCubeToRight, rotateCubeToBottom, rotateCubeToTop, moveFromLeftFade, moveFromRightFade, moveFromTopFade, moveFromBottomFade, moveFromLeft, moveFromRight, moveFromBottom, slide, fromLeftEasing, fromRightEasing, fromBottomEasing, fromTopEasing, scaleDownFromLeft, scaleDownFromRight, scaleDownFromBottom, scaleDownFromTop, rotateSides, rotateGlueFromRight, rotateGlueFromLeft, rotateGlueFromBottom, rotateGlueFromTop, rotateFlipToLeft, rotateFlipToBottom, rotateFlipToTop, rotateFlipToRight, rotateRoomToLeft, rotateRoomToRight, rotateRoomToBottom, rotateRoomToTop, rotateCarouselToLeft, rotateCarouselToRight, rotateCarouselToBottom, rotateCarouselToTop } from "ngx-router-animations";


export const managerRouteAnimations = trigger('managerRouteAnimations', [

  transition('* =>  manager-home', [
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
  ]),

  transition('manager-home => teachers', useAnimation(rotateCarouselToTop)),
  transition('manager-home => students', useAnimation(rotateCarouselToTop)),
  transition('manager-home => courses', useAnimation(rotateCarouselToTop)),
  transition('manager-home => subjects', useAnimation(rotateCarouselToTop)),

  transition('teachers => students', useAnimation(rotateCarouselToLeft)),
  transition('teachers => courses', useAnimation(rotateCarouselToTop)),
  transition('teachers => subjects', useAnimation(rotateCarouselToTop)),

  transition('students => teachers', useAnimation(rotateCarouselToRight)),
  transition('students => courses', useAnimation(rotateCarouselToTop)),
  transition('students => subjects', useAnimation(rotateCarouselToTop)),

  transition('courses => teachers', useAnimation(rotateCarouselToBottom)),
  transition('courses => students', useAnimation(rotateCarouselToBottom)),
  transition('courses => subjects', useAnimation(rotateCarouselToTop)),
  transition('courses => courses-create', useAnimation(scaleDownFromLeft)),
  transition('courses => courses-name', useAnimation(scaleDownFromLeft)),
  transition('courses-create => courses', useAnimation(scaleDownFromRight)),
  transition('courses-name => courses', useAnimation(scaleDownFromRight)),

  transition('subjects => teachers', useAnimation(rotateCarouselToBottom)),
  transition('subjects => students', useAnimation(rotateCarouselToBottom)),
  transition('subjects => courses', useAnimation(rotateCarouselToBottom)),

  //transition('* => subjects', useAnimation(slide)),

  //fadeIn
  /*transition('* => subjects', [
    // Set a default  style for enter and leave
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        //opacity: 0,
        //transform: 'scale(0) translateY(100%)',
      }),
    ], { optional: true }),
    group([
      // Animate the new page in
      query(':enter', [
        animate('600ms ease', keyframes([
          style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
        ])),
      ], { optional: true }),

      // Animate the old page out
      query(':leave', [
        animate('600ms ease', keyframes([
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
          style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
        ])),
      ], { optional: true }),

      query(':leave router-outlet ~ *', [
        style({ opacity: .99999 }),
        animate(600, style({ opacity: 1 }))
      ], { optional: true })

    ]),
  ])

  //stepper
  /*transition('subjects => course-id', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),
    group([
      query(':enter', [
        animate('2000ms ease', keyframes([
          style({ transform: 'scale(0) translateX(100%)', offset: 0 }),
          style({ transform: 'scale(0.5) translateX(25%)', offset: 0.3 }),
          style({ transform: 'scale(1) translateX(0%)', offset: 1 }),
        ])),
      ], { optional: true }),
      query(':leave', [
        animate('2000ms ease', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(0.5) translateX(-25%) rotate(0)', offset: 0.35 }),
          style({ opacity: 0, transform: 'translateX(-50%) rotate(-180deg) scale(6)', offset: 1 }),
        ])),
      ], { optional: true }),
   
    ]),
  ]), */

  //fadeIn
  /* transition('* <=> *', [
     // Set a default  style for enter and leave
     query(':enter, :leave', [
       style({
         position: 'absolute',
         left: 0,
         width: '100%',
         //opacity: 0,
         //transform: 'scale(0) translateY(100%)',
       }),
     ], { optional: true }),
     group([
       // Animate the new page in
       query(':enter', [
         animate('600ms ease', keyframes([
           style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
           style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
         ])),
       ], { optional: true }),
 
       // Animate the old page out
       query(':leave', [
         animate('600ms ease', keyframes([
           style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
           style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
         ])),
       ], { optional: true }),
 
       query('router-outlet ~ *', [style({}), animate(1, style({}))], { optional: true })
 
 
 
     ]),
   ])*/


   
  //fadeIn
  transition('* => courses', [
    // Set a default  style for enter and leave
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        //opacity: 0,
        //transform: 'scale(0) translateY(100%)',
      }),
    ], { optional: true }),
    group([
      // Animate the new page in
      query(':enter', [
        animate('600ms ease', keyframes([
          style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
        ])),
        animateChild(),
      ], { optional: true }),

      // Animate the old page out
      query(':leave', [
        animate('600ms ease', keyframes([
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
          style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
        ])),
        animateChild(),
      ], { optional: true }),


    ]),
  ])



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

  //transition('* => subjects', useAnimation(slide)),
  //transition('* => subjects-detail-id', useAnimation(slide)),
  //transition('* => course-id', useAnimation(slide)),
  /*transition('* => evaluations-id', useAnimation(slide)),
  transition('* => attendance-id', useAnimation(slide)),
  transition('* => grades-id', useAnimation(slide)), */





  

    //fadeIn
    transition('* => course-id', [
      // Set a default  style for enter and leave
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          //opacity: 0,
          //transform: 'scale(0) translateY(100%)',
        }),
      ], { optional: true }),
      group([
        // Animate the new page in
        query(':enter', [
          animate('600ms ease', keyframes([
            style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
            style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
          ])),
          animateChild(),
        ], { optional: true }),
  
        // Animate the old page out
        query(':leave', [
          animate('600ms ease', keyframes([
            style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
            style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
          ])),
          animateChild(),
        ], { optional: true }),
  
  
      ]),
    ])

    ,  //fadeIn
    transition('* => *', [
      // Set a default  style for enter and leave
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          //opacity: 0,
          //transform: 'scale(0) translateY(100%)',
        }),
      ], { optional: true }),
      group([
        // Animate the new page in
        query(':enter', [
          animate('600ms ease', keyframes([
            style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
            style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
          ])),
          animateChild(),
        ], { optional: true }),
  
        // Animate the old page out
        query(':leave', [
          animate('600ms ease', keyframes([
            style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
            style({ opacity: 0, transform: 'scale(0) translateY(100%)' }),
          ])),
          animateChild(),
        ], { optional: true }),
  
  
      ]),
    ])
  



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


