import { ComponentFixture, flush } from '@angular/core/testing';

export abstract class AbstractComponentTester<T> {

    constructor(public fixture:ComponentFixture<T>) {
    }

    detectAndFlush() {
        this.fixture.detectChanges();
        flush();
    }
}
