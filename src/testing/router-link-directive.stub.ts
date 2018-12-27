// tslint:disable:directive-selector
// tslint:disable:directive-class-suffix
import { Directive, HostListener, Input } from '@angular/core';

// @ts-ignore
@Directive({
    selector: '[routerLink]',
})
export class RouterLinkDirectiveStub {

    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    @HostListener('click')
    onClick() {
        this.navigatedTo = this.linkParams;
    }
}
