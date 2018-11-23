import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector:'ba-root',
    template:'<router-outlet></router-outlet>',
})
export class AppComponent {

    constructor(private titleService:Title) {

        titleService.setTitle('Brennus Analytics');
    }
}
