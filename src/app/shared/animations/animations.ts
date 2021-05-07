import { trigger, state, style, transition, animate, animateChild, query, group, keyframes, useAnimation, AnimationMetadata, animation } from '@angular/animations';
import {
  rotateCubeToLeft, moveFromTop, rotateCubeToRight, rotateCubeToBottom, rotateCubeToTop,
  moveFromLeftFade, moveFromRightFade, moveFromTopFade, moveFromBottomFade, moveFromLeft, moveFromRight,
  moveFromBottom, slide, fromLeftEasing, fromRightEasing, fromBottomEasing, fromTopEasing, scaleDownFromLeft,
  scaleDownFromRight, scaleDownFromBottom, scaleDownFromTop, rotateSides, rotateGlueFromRight, rotateGlueFromLeft,
  rotateGlueFromBottom, rotateGlueFromTop, rotateFlipToLeft, rotateFlipToBottom, rotateFlipToTop, rotateFlipToRight,
  rotateRoomToLeft, rotateRoomToRight, rotateRoomToBottom, rotateRoomToTop, rotateCarouselToLeft, rotateCarouselToRight,
  rotateCarouselToBottom, rotateCarouselToTop
} from "ngx-router-animations";
import { sharedStyles, moveFromRightKeyframes, moveFromLeftKeyframes, scaleDownKeyframes } from './customAnim';



export const mainRouteAnimations = trigger('mainRouteAnimations', [

  transition('* <=> *', [
    group([
      useAnimation(slide),
      query('router-outlet ~ *', [style({}), animate(1, style({}))], { optional: true })
    ])
  ]),

]);

export const routeAnimations = trigger('routeAnimations', [

  transition(`* => subjects-detail`
    , [
      query(':enter #subjectDetailOutlet ~ *, :leave', style(sharedStyles), { optional: true }),
      group([
        query(':enter #subjectDetailOutlet ~ *', [
          style({ 'z-index': 999 }),
          animate('0.6s 0s ease', moveFromRightKeyframes),
        ], { optional: true }),

        query(':enter .toolbarSubjectMenu', [
          style({ opacity: 0 }),
          animate('1s', style({ opacity: 1 }))
        ], { optional: true }),

        query(':leave', [
          animate('0.7s 0s ease', scaleDownKeyframes),
        ], { optional: true }),
      ])
    ]),

  transition(`subjects-detail => *`, [
    query(':enter, :leave #subjectDetailOutlet ~ *', style(sharedStyles), { optional: true }),
    group([
      query(':enter', [
        style({ 'z-index': 999 }),
        animate('0.6s 0s ease', moveFromLeftKeyframes),
      ], { optional: true }),

      query(':leave .toolbarSubjectMenu', [
        style({ opacity: 1 }),
        animate('1s', style({ opacity: 0 }))
      ], { optional: true }),

      query(':leave #subjectDetailOutlet ~ *', [
        animate('0.7s 0s ease', scaleDownKeyframes),
      ], { optional: true }),

    ]),
  ]),

  transition('* <=> *', useAnimation(slide)),

]);

export const subjectRouteAnimations = trigger('subjectRouteAnimations', [
  transition('* <=> *', useAnimation(slide)),

]);

export const onSideNavChange = trigger('onSideNavChange', [
  state('false',
    style({ 'width': '65px' })
  ),
  state('true',
    style({ 'width': '351px' })
  ),
  transition('* <=> *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);

export const onMainContentChangeLeft = trigger('onMainContentChangeLeft', [
  state('false',
    style({ 'margin-left': '65px' })
  ),
  state('true',
    style({ 'margin-left': '351px' })
  ),
  transition('* <=> *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
]);

export const onMainContentChangeRight = trigger('onMainContentChangeRight', [
  state('false',
    style({ 'margin-right': '65px' })
  ),
  state('true',
    style({ 'margin-right': '351px' })
  ),
  transition('* <=> *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);

export const logoNavChange = trigger('logoNavChange', [
  state('false',
    style({ 'margin-left': '0' })
  ),
  state('true',
    style({ 'margin-left': '131px' })
  ),
  transition('* <=> *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);

export const animateText = trigger('animateText', [
  state('false',
    style({
      'display': 'none',
      'opacity': '0'
    })
  ),
  state('true',
    style({
      'display': 'block',
      'opacity': '1'
    })
  ),
  //transition('* <=> *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [

    query(':enter, :leave', [style(sharedStyles)], { optional: true }),

    group([
      query(':leave',
        [
          style({ opacity: 1 }),
          animate('0.5s', style({ opacity: 0 }))
        ], { optional: true }
      ),

      query(':enter',
        [
          style({ opacity: 0 }),
          animate('0.5s', style({ opacity: 1 }))
        ], { optional: true }
      )])

  ]),

]);

export const fadeAnimation2 = trigger('fadeAnimation2', [
  transition('* <=> *', [

    query(':enter', [style({ opacity: 0 })], { optional: true }),

    query(':leave',
      [
        style({ opacity: 1 }),
        animate('0.5s', style({ opacity: 0 }))
      ], { optional: true }
    ),

  ]),

]);


//fixes mat-table animations
export const rowAnimation = trigger('rowAnimation', [transition('* => void', [animate('0ms', style({ display: 'none' }))])]);

export const waitAnimation = trigger('waitAnimation', [transition('* => void', [style({}), animate(1, style({}))])]);






