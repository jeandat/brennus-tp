import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ActivityIndicatorService } from './activity-indicator.service';

describe('ActivityIndicatorService', () => {

    let service:ActivityIndicatorService;
    let sub:Subscription;

    const groupName = 'group';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:[ ActivityIndicatorService ]
        });
        service = TestBed.get(ActivityIndicatorService);
    });

    afterEach(() => {
        if(sub) sub.unsubscribe();
    });

    it('should be false by default', async (done) => {
        sub = service.busy$.subscribe((state:boolean) => {
            expect(state).toBe(false);
            done();
        });
    });

    it('should be true after #on() is called', async (done) => {
        sub = service.busy$.pipe(skip(1)).subscribe((state:boolean) => {
            expect(state).toBe(true);
            sub.unsubscribe();
            done();
        });
        service.on();
    });

    it('should be false after #off() is called', async (done) => {
        sub = service.busy$.pipe(skip(2)).subscribe((state:boolean) => {
            expect(state).toBe(false);
            sub.unsubscribe();
            done();
        });
        service.on();
        service.off();
    });

    it('should be false after first #off() whatever the number of #on()', () => {
        service.on(groupName);
        service.on(groupName);
        service.off(groupName);
        expect(service.getInstantState()).toBe(false);
        service.off(groupName);
        expect(service.getInstantState()).toBe(false);
    });
});
