import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


/*
 Let components be notified when there is processing in the background.
 */

@Injectable({
    providedIn:'root'
})
export class ActivityIndicatorService {

    private subject = new BehaviorSubject<boolean>(false);
    public busy$: Observable<boolean> = this.subject.asObservable();

    private groups = new Set();

    private consumers = 0;

    on(groupName?: string) {
        if (groupName) {
            if (this.groups.has(groupName)) return;
            this.groups.add(groupName);
        }
        this.consumers++;
        // console.log('consumers:', this.consumers);
        // console.log('groups:', this.groups);
        this.subject.next(true);
    }

    off(groupName?: string) {
        if (groupName) {
            if (!this.groups.has(groupName)) return;
            this.groups.delete(groupName);
        }
        if (this.consumers > 0) this.consumers--;
        // console.log('consumers:', this.consumers);
        // console.log('groups:', this.groups);
        if (this.consumers === 0) this.subject.next(false);
    }

    getInstantState():boolean {
        return this.subject.getValue();
    }

}


