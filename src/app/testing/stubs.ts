
import { Router, RouterLink, ActivatedRoute, ParamMap, Params, convertToParamMap } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Directive, Input, HostListener, Component } from "@angular/core";

export let httpStub: Partial<HttpClient>;
export let routerStub: Partial<Router>;
export let routerLinkStub: Partial<RouterLink>;
export let activatedRouteStub: Partial<ActivatedRoute>;


export class ActivatedRouteStub {
    // Use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable
    private subject = new ReplaySubject<ParamMap>();
  
    constructor(initialParams?: Params) {
      this.setParamMap(initialParams);
    }
  
    /** The mock paramMap observable */
    readonly paramMap = this.subject.asObservable();
  
    /** Set the paramMap observables's next value */
    setParamMap(params?: Params) {
      this.subject.next(convertToParamMap(params));
    };
  }


  @Directive({
    selector: '[routerLink]'
  })
  export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;
  
    @HostListener('click')
    onClick() {
      this.navigatedTo = this.linkParams;
    }
  }


  @Component({selector: 'router-outlet', template: ''})
export class RouterOutletStubComponent { }