import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector:'ba-root',
    template:`
        <ba-navbar></ba-navbar>
        <router-outlet></router-outlet>
    `,
})
export class AppComponent implements OnInit {

    ngOnInit():void {
        if (this.isTouchDevice()) {
            document.body.classList.add('touch-device');
        }
    }

    constructor(private titleService:Title) {
        titleService.setTitle('Brennus Analytics');
    }

    isTouchDevice() {
        // tslint:disable-next-line
        const navigator = window.navigator as any;
        return !!('ontouchstart' in window) || !!('msmaxtouchpoints' in navigator);
    }
}
