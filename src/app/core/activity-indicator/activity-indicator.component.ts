import { Component, OnInit } from '@angular/core';
import { ActivityIndicatorService } from './activity-indicator.service';

@Component({
    selector:'ba-activity-indicator',
    template:`
        <ngx-loading [show]="ais.busy$ | async" aria-label="activity indicator for the entire app"></ngx-loading>
    `,
    styleUrls:['./activity-indicator.component.scss']
})
export class ActivityIndicatorComponent implements OnInit {

    constructor(public ais:ActivityIndicatorService) { }

    ngOnInit() {}
}
