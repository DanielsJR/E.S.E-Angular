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

  transition('welcome => login, * => not-found', [
    group([
      useAnimation(rotateCubeToLeft),
      query('router-outlet ~ *', [style({}), animate(1, style({}))], { optional: true })
    ])
  ]),

  transition('login => welcome, not-found => *', useAnimation(rotateCubeToRight)),

  transition('welcome => main-home , main-home => login', [
    group([
      useAnimation(rotateCubeToTop),
      query('router-outlet ~ *', [style({}), animate(1, style({}))], { optional: true })
    ])
  ]),

  transition('main-home => welcome, login => main-home', [
    group([
      useAnimation(rotateCubeToBottom),
      query('router-outlet ~ *', [style({}), animate(1, style({}))], { optional: true })
    ])
  ]),


]);

export const routeAnimations = trigger('routeAnimations', [

  //admin
  transition('home => managers', useAnimation(rotateCarouselToTop)),
  transition('managers => home', useAnimation(rotateCarouselToBottom)),
  transition('managers => teachers', useAnimation(rotateCarouselToLeft)),
  transition('teachers => managers', useAnimation(rotateCarouselToRight)),

  //manager
  transition('home => teachers', useAnimation(rotateCarouselToTop)),
  transition('home => students', useAnimation(rotateCarouselToTop)),
  transition('home => courses', useAnimation(rotateCarouselToTop)),
  transition('home => manager-subjects', useAnimation(rotateCarouselToTop)),
  transition('home => manager-courses', useAnimation(rotateCarouselToTop)),
  transition('home => courses-create', useAnimation(rotateCarouselToTop)),
  //---
  transition('home => teacher-subjects', useAnimation(rotateCarouselToTop)),
  transition('home => quizes', useAnimation(rotateCarouselToTop)),
  transition('home => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('home => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('home => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('home => quizes-historical', useAnimation(rotateCarouselToTop)),

  transition('teachers => home', useAnimation(rotateCarouselToBottom)),
  transition('teachers => students', useAnimation(rotateCarouselToLeft)),
  transition('teachers => courses', useAnimation(rotateCarouselToTop)),
  transition('teachers => manager-subjects', useAnimation(rotateCarouselToTop)),
  transition('teachers => courses-create', useAnimation(rotateCarouselToTop)),
  transition('teachers => courses-name', useAnimation(rotateCarouselToTop)),
  //--
  transition('teachers => teacher-subjects', useAnimation(rotateCarouselToTop)),
  transition('teachers => quizes', useAnimation(rotateCarouselToTop)),
  transition('teachers => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('teachers => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('teachers => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('teachers => quizes-historical', useAnimation(rotateCarouselToTop)),

  transition('students => home', useAnimation(rotateCarouselToBottom)),
  transition('students => teachers', useAnimation(rotateCarouselToRight)),
  transition('students => courses', useAnimation(rotateCarouselToTop)),
  transition('students => manager-subjects', useAnimation(rotateCarouselToTop)),
  transition('students => courses-create', useAnimation(rotateCarouselToTop)),
  transition('students => courses-name', useAnimation(rotateCarouselToTop)),
  //--
  transition('students => teacher-subjects', useAnimation(rotateCarouselToTop)),
  transition('students => quizes', useAnimation(rotateCarouselToTop)),
  transition('students => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('students => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('students => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('students => quizes-historical', useAnimation(rotateCarouselToTop)),

  transition('courses => home', useAnimation(rotateCarouselToBottom)),
  transition('courses => teachers', useAnimation(rotateCarouselToBottom)),
  transition('courses => students', useAnimation(rotateCarouselToBottom)),
  transition('courses => manager-subjects', useAnimation(rotateCarouselToTop)),
  transition('courses => teacher-subjects', useAnimation(rotateCarouselToTop)),
  transition('courses => courses-create', useAnimation(scaleDownFromRight)),
  transition('courses => courses-name', useAnimation(scaleDownFromRight)),
  //--
  transition('courses => teacher-subjects', useAnimation(rotateCarouselToTop)),
  transition('courses => quizes', useAnimation(rotateCarouselToTop)),
  transition('courses => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('courses => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('courses => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('courses => quizes-historical', useAnimation(rotateCarouselToTop)),

  transition('courses-create => home', useAnimation(rotateCarouselToBottom)),
  transition('courses-create => courses', useAnimation(scaleDownFromLeft)),
  transition('courses-create => teachers', useAnimation(rotateCarouselToBottom)),
  transition('courses-create => students', useAnimation(rotateCarouselToBottom)),
  transition('courses-create => manager-subjects', useAnimation(rotateCarouselToTop)),
  transition('courses-create => teacher-subjects', useAnimation(rotateCarouselToTop)),
  //--
  transition('courses-create => teacher-subjects', useAnimation(rotateCarouselToTop)),
  transition('courses-create => quizes', useAnimation(rotateCarouselToTop)),
  transition('courses-create => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('courses-create => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('courses-create => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('courses-create => quizes-historical', useAnimation(rotateCarouselToTop)),

  transition('courses-name => home', useAnimation(rotateCarouselToBottom)),
  transition('courses-name => courses', useAnimation(scaleDownFromLeft)),
  transition('courses-name => teachers', useAnimation(rotateCarouselToBottom)),
  transition('courses-name => students', useAnimation(rotateCarouselToBottom)),
  transition('courses-name => manager-subjects', useAnimation(rotateCarouselToTop)),
  transition('courses-name => teacher-subjects', useAnimation(rotateCarouselToTop)),
  //--
  transition('courses-name => teacher-subjects', useAnimation(rotateCarouselToTop)),
  transition('courses-name => quizes', useAnimation(rotateCarouselToTop)),
  transition('courses-name => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('courses-name => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('courses-name => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('courses-name => quizes-historical', useAnimation(rotateCarouselToTop)),

  transition('manager-subjects => home', useAnimation(rotateCarouselToBottom)),
  transition('manager-subjects => teachers', useAnimation(rotateCarouselToBottom)),
  transition('manager-subjects => students', useAnimation(rotateCarouselToBottom)),
  transition('manager-subjects => courses', useAnimation(rotateCarouselToBottom)),
  transition('manager-subjects => courses-create', useAnimation(rotateCarouselToBottom)),
  transition('manager-subjects => courses-name', useAnimation(rotateCarouselToBottom)),
  //--
  transition('manager-subjects => teacher-subjects', useAnimation(rotateCarouselToTop)),
  transition('manager-subjects => quizes', useAnimation(rotateCarouselToTop)),
  transition('manager-subjects => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('manager-subjects => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('manager-subjects => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('manager-subjects => quizes-historical', useAnimation(rotateCarouselToTop)),


  //teacher
  transition('home => quizes', useAnimation(rotateCarouselToTop)),
  transition('home => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('home => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('home => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('home => quizes-historical', useAnimation(rotateCarouselToTop)),

  transition('teacher-subjects => quizes', useAnimation(rotateCarouselToTop)),
  transition('teacher-subjects => quizes-detail', useAnimation(rotateCarouselToTop)),
  transition('teacher-subjects => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('teacher-subjects => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('teacher-subjects => quizes-historical', useAnimation(rotateCarouselToTop)),
  //--
  transition('teacher-subjects => home', useAnimation(rotateCarouselToBottom)),
  transition('teacher-subjects => teachers', useAnimation(rotateCarouselToBottom)),
  transition('teacher-subjects => students', useAnimation(rotateCarouselToBottom)),
  transition('teacher-subjects => courses', useAnimation(rotateCarouselToBottom)),
  transition('teacher-subjects => courses-create', useAnimation(rotateCarouselToBottom)),
  transition('teacher-subjects => courses-name', useAnimation(rotateCarouselToBottom)),
  transition('teacher-subjects => manager-subjects', useAnimation(rotateCarouselToBottom)),

  transition('quizes => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes => teacher-subjects', useAnimation(rotateCarouselToBottom)),
  transition('quizes => quizes-detail', useAnimation(scaleDownFromRight)),
  transition('quizes => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('quizes => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('quizes => quizes-historical', useAnimation(rotateCarouselToTop)),
  //--
  transition('quizes => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes => teachers', useAnimation(rotateCarouselToBottom)),
  transition('quizes => students', useAnimation(rotateCarouselToBottom)),
  transition('quizes => courses', useAnimation(rotateCarouselToBottom)),
  transition('quizes => courses-create', useAnimation(rotateCarouselToBottom)),
  transition('quizes => courses-name', useAnimation(rotateCarouselToBottom)),
  transition('quizes => manager-subjects', useAnimation(rotateCarouselToBottom)),

  transition('quizes-detail => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes-detail => teacher-subjects', useAnimation(rotateCarouselToBottom)),
  transition('quizes-detail => quizes', useAnimation(scaleDownFromLeft)),
  transition('quizes-detail => quizes-create', useAnimation(rotateCarouselToTop)),
  transition('quizes-detail => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('quizes-detail => quizes-historical', useAnimation(rotateCarouselToTop)),
  //--
  transition('quizes-detail => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes-detail => teachers', useAnimation(rotateCarouselToBottom)),
  transition('quizes-detail => students', useAnimation(rotateCarouselToBottom)),
  transition('quizes-detail => courses', useAnimation(rotateCarouselToBottom)),
  transition('quizes-detail => courses-create', useAnimation(rotateCarouselToBottom)),
  transition('quizes-detail => courses-name', useAnimation(rotateCarouselToBottom)),
  transition('quizes-detail => manager-subjects', useAnimation(rotateCarouselToBottom)),

  transition('quizes-create => quizes', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => quizes-detail', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => quizes-import', useAnimation(rotateCarouselToTop)),
  transition('quizes-create => quizes-historical', useAnimation(rotateCarouselToTop)),
  transition('quizes-create => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => teacher-subjects', useAnimation(rotateCarouselToBottom)),
  //--
  transition('quizes-create => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => teachers', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => students', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => courses', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => courses-create', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => courses-name', useAnimation(rotateCarouselToBottom)),
  transition('quizes-create => manager-subjects', useAnimation(rotateCarouselToBottom)),

  transition('quizes-import => quizes', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => quizes-detail', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => quizes-create', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => quizes-historical', useAnimation(rotateCarouselToTop)),
  transition('quizes-import => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => teacher-subjects', useAnimation(rotateCarouselToBottom)),
  //--
  transition('quizes-import => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => teachers', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => students', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => courses', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => courses-create', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => courses-name', useAnimation(rotateCarouselToBottom)),
  transition('quizes-import => manager-subjects', useAnimation(rotateCarouselToBottom)),

  transition('quizes-historical => quizes', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => quizes-detail', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => quizes-create', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => quizes-import', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => teacher-subjects', useAnimation(rotateCarouselToBottom)),
  //--
  transition('quizes-historical => home', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => teachers', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => students', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => courses', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => courses-create', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => courses-name', useAnimation(rotateCarouselToBottom)),
  transition('quizes-historical => manager-subjects', useAnimation(rotateCarouselToBottom)),

  //student
  transition('home => student-subjects', useAnimation(rotateCarouselToTop)),
  transition('student-subjects => home', useAnimation(rotateCarouselToBottom)),


  //subject-detail
  transition(`home => subjects-detail,
  teachers => subjects-detail,
  students => subjects-detail,
  courses => subjects-detail,
  courses-create => subjects-detail,
  courses-name => subjects-detail,
  manager-subjects => subjects-detail,
  teacher-subjects => subjects-detail,
  student-subjects => subjects-detail,
  quizes => subjects-detail,
  quizes-detail => subjects-detail,
  quizes-create => subjects-detail,
  quizes-import => subjects-detail,
  quizes-historical => subjects-detail`, [
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

  transition(`subjects-detail => home,
  subjects-detail => teachers,
  subjects-detail => students,
  subjects-detail => courses,
  subjects-detail => courses-create,
  subjects-detail => courses-name,
  subjects-detail => manager-subjects,
  subjects-detail => teacher-subjects,
  subjects-detail => student-subjects,
  subjects-detail => quizes,
  subjects-detail => quizes-detail,
  subjects-detail => quizes-create,
  subjects-detail => import,
  subjects-detail => historical`, [
    query(':enter, :leave #subjectDetailOutlet ~ *', style(sharedStyles), { optional: true }),
    group([
      query(':enter', [
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



]);

export const subjectRouteAnimations = trigger('subjectRouteAnimations', [
  transition('course-id => evaluations-id', useAnimation(rotateCarouselToLeft)),
  transition('course-id => attendance-id', useAnimation(rotateCarouselToLeft)),
  transition('course-id => book-id', useAnimation(rotateCarouselToLeft)),
  transition('course-id => quiz-id', useAnimation(rotateCarouselToLeft)),
  transition('course-id => student-grades-id', useAnimation(rotateCarouselToLeft)),
  transition('course-id => grades-id', useAnimation(scaleDownFromRight)),

  transition('grades-id => *', useAnimation(scaleDownFromLeft)),

  transition('evaluations-id => course-id', useAnimation(rotateCarouselToRight)),
  transition('evaluations-id => attendance-id', useAnimation(rotateCarouselToLeft)),
  transition('evaluations-id => book-id', useAnimation(rotateCarouselToLeft)),
  transition('evaluations-id => quiz-id', useAnimation(rotateCarouselToLeft)),
  //transition('evaluations-id => student-grades-id', useAnimation(scaleDownFromRight)),

  transition('attendance-id => course-id', useAnimation(rotateCarouselToRight)),
  transition('attendance-id => evaluations-id', useAnimation(rotateCarouselToRight)),
  transition('attendance-id => book-id', useAnimation(rotateCarouselToLeft)),
  transition('attendance-id => quiz-id', useAnimation(rotateCarouselToLeft)),
  transition('attendance-id => student-grades-id', useAnimation(rotateCarouselToLeft)),

  transition('book-id => course-id', useAnimation(rotateCarouselToRight)),
  transition('book-id => evaluations-id', useAnimation(rotateCarouselToRight)),
  transition('book-id => attendance-id', useAnimation(rotateCarouselToRight)),
  transition('book-id => quiz-id', useAnimation(rotateCarouselToLeft)),
  transition('book-id => student-grades-id', useAnimation(rotateCarouselToLeft)),

  transition('quiz-id => course-id', useAnimation(rotateCarouselToRight)),
  transition('quiz-id => evaluations-id', useAnimation(rotateCarouselToRight)),
  transition('quiz-id => attendance-id', useAnimation(rotateCarouselToRight)),
  transition('quiz-id => book-id', useAnimation(rotateCarouselToRight)),
  transition('quiz-id => student-grades-id', useAnimation(rotateCarouselToRight)),

  transition('student-grades-id => course-id', useAnimation(rotateCarouselToRight)),
  transition('student-grades-id => evaluations-id', useAnimation(rotateCarouselToRight)),
  transition('student-grades-id => attendance-id', useAnimation(rotateCarouselToRight)),
  transition('student-grades-id => book-id', useAnimation(rotateCarouselToRight)),
  transition('student-grades-id => quiz-id', useAnimation(rotateCarouselToLeft)),


  //transition('* <=> *', useAnimation(slide)),

]);

export const onSideNavChange = trigger('onSideNavChange', [
  state('false',
    style({ 'width': '65px' })
  ),
  state('true',
    style({ 'width': '351px' })
  ),
  transition('* <=> *', animate('250ms ease-in')),
]);

export const onMainContentChangeLeft = trigger('onMainContentChangeLeft', [
  state('false',
    style({ 'margin-left': '65px' })
  ),
  state('true',
    style({ 'margin-left': '351px' })
  ),
  transition('* <=> *', animate('250ms ease-in')),
]);

export const onMainContentChangeRight = trigger('onMainContentChangeRight', [
  state('false',
    style({ 'margin-right': '65px' })
  ),
  state('true',
    style({ 'margin-right': '351px' })
  ),
  transition('* <=> *', animate('250ms ease-in')),
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

export const waitAnimation = trigger('waitAnimation', [transition('* => void', [style({}), animate(1, style({}))])]);






