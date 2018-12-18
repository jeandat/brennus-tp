import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
    selector:'ba-navbar',
    templateUrl:'./navbar.component.html',
    styleUrls:['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    menuOpened = false;

    constructor(private router:Router) {
    }

    ngOnInit():void {
        this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
            this.menuOpened = false;
        });
    }

    toggleMenu() {
        this.menuOpened = this.menuOpened ? false : true;
    }
}
