import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { goodSelectors } from '../../good/store/good.selectors';
import { startWith, takeUntil } from 'rxjs/operators';
import { Good } from '../../core/model/good.model';
import { Observable, Subject } from 'rxjs';
import { AppState } from '../../core/store/core.reducer';


@Component({
    selector:'ba-statistic-list',
    templateUrl:'./statistic-list.component.html',
    styleUrls:[ './statistic-list.component.scss' ]
})
export class StatisticListComponent implements OnInit, OnDestroy {

    // Goods
    // -----

    goods$:Observable<Good[]>;

    // Chart properties
    // ----------------

    public barChartOptions = { scaleShowVerticalLines:false, responsive:true };
    public barChartLabels = [];
    public barChartData = [];

    // Utils
    // -----

    // Used to clear subscriptions
    private done:Subject<boolean> = new Subject();

    constructor(private store:Store<AppState>) {}

    ngOnInit():void {
        this.setGoods();
    }

    ngOnDestroy():void {
        this.done.next(true);
        this.done.complete();
    }

    setGoods() {
        this.store.pipe(
            select(goodSelectors.selectAll),
            takeUntil(this.done)
        ).subscribe(
            ((goods:Good[]) => {

                const labels = new Set<string>();
                const counts = [];
                const averages = [];

                // Search for unique types
                // It would be a single line with lodash but I would rather not add another dependency
                goods.forEach(good => labels.add(good.type));
                this.barChartLabels = Array.from(labels);

                this.barChartLabels.forEach(label => {
                    let count = 0;
                    let total = 0;
                    // For each quality, compute number of items and average quality
                    goods.forEach(good => {
                        if (good.type === label) {
                            count++;
                            total += good.quality;
                        }
                    });
                    counts.push(count);
                    averages.push(Math.floor(total / count));
                });

                // Change current chart data
                this.barChartData = [
                    { data:counts, label:'Count' },
                    { data:averages, label:'Average Quality' }
                ];
            })
        );
    }

}
