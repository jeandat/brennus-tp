import { async, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ComponentTester, speculoosMatchers } from 'ngx-speculoos';


class HomeComponentTester extends ComponentTester<HomeComponent> {

    constructor() {
        super(HomeComponent);
    }
}


describe('HomeComponent', () => {
    let tester: HomeComponentTester;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[ HomeComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        tester = new HomeComponentTester();
        tester.detectChanges();
        jasmine.addMatchers(speculoosMatchers);
    });

    it('should have …', () => {
        throw new Error('TODO');
    });
});
