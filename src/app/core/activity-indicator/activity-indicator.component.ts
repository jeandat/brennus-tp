import { Component, OnInit } from '@angular/core';
import { ActivityIndicatorService } from './activity-indicator.service';

@Component({
    selector:'ba-activity-indicator',
    template:`
        <div class="preloader-wrapper small active" *ngIf="ais.busy$ | async">
            <div class="spinner-layer">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div>
                <div class="gap-patch">
                    <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    `,
    styleUrls:['./activity-indicator.component.scss']
})
export class ActivityIndicatorComponent implements OnInit {

    constructor(public ais:ActivityIndicatorService) { }

    ngOnInit() {}
}
