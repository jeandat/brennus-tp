import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Sidenav = M.Sidenav;


@Component({
    selector:'ba-navbar',
    template:`
        <nav>
            <div class="nav-wrapper">
                <div class="brand-logo"><img src="/assets/brennus-logo.svg"></div>
                <a href="#" data-target="nav-mobile" class="sidenav-trigger no-underline"><i class="material-icons">menu</i></a>
                <ul id="nav-desktop" class="hide-on-med-and-down no-underline">
                    <li routerLinkActive="active" class="nav-link"><a routerLink="/home">Home</a></li>
                    <li routerLinkActive="active" #rla="routerLinkActive" class="nav-link"><a routerLink="/admin">Admin</a></li>
                </ul>
                <ba-activity-indicator class="right"></ba-activity-indicator>
            </div>
        </nav>
        <ul #sidenav class="sidenav no-underline" id="nav-mobile">
            <li class="sidenav__header"></li>
            <li routerLinkActive="active" class="nav-link"><a class="waves-effect sidenav-close" routerLink="/home">Home</a></li>
            <li routerLinkActive="active" class="nav-link"><a class="waves-effect sidenav-close" routerLink="/admin">Admin</a></li>
        </ul>
    `,
    styleUrls:[ './navbar.component.scss' ]
})
export class NavbarComponent implements AfterViewInit {

    @ViewChild('sidenav', { read:ElementRef }) sidenavEl: ElementRef;

    private sidenav: Sidenav;

    constructor() { }

    ngAfterViewInit(): void {
        this.sidenav = M.Sidenav.init(this.sidenavEl.nativeElement, {});
    }


}
