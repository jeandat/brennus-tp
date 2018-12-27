import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSlider } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilKeyChanged, filter, first, map, takeUntil, tap } from 'rxjs/operators';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { Good } from '../../core/model/good.model';
import { BaHttpErrorResponse } from '../../core/network/ba-http-error-response';
import { SnackBarService } from '../../core/snackbar/snackbar.service';
import { AppState } from '../../core/store/core.reducer';
import { GoodService } from '../good-service/good.service';
import { SearchCriteria } from '../model/search-criteria.model';
import { GSV_SetSearchFilters } from '../store/good.actions';
import { goodSelectors } from '../store/good.selectors';
import { ColumnDefinition } from './column-definition';


@Component({
    selector:'ba-good-search',
    templateUrl:'./good-search.component.html',
    styleUrls:['./good-search.component.scss']
})
export class GoodSearchComponent implements OnInit, OnDestroy {

    // Search Form
    // -----------

    // DOM references
    @ViewChild('searchInput', {read:ElementRef}) searchInput:ElementRef;
    @ViewChild('minQualitySlider') minQualitySlider:MatSlider;
    // Current selected filters
    criteria = new SearchCriteria();
    goods$:Observable<Good[]>;


    // Data
    // -----
    selectedRows:any[] = [];


    // Datatable
    // ---------
    noResult = true;
    // Should we use virtual scrolling?
    scrollbarV = true;
    // Table properties
    rowHeight = 50;
    headerHeight = 50;
    footerHeight = 50;
    // DOM References
    @ViewChild('datatable') datatable:DatatableComponent;
    // Columns definition
    columns:ColumnDefinition[];


    // Utils
    // -----

    // Used to clear subscriptions
    private done:Subject<boolean> = new Subject();

    constructor(
        private goodService:GoodService,
        private ais:ActivityIndicatorService,
        private store:Store<AppState>,
        private router:Router,
        private route:ActivatedRoute,
        private snackbar:SnackBarService) {
    }

    ngOnInit() {
        this.listenToErrors();
        this.listenToSearchEvents();
        this.setColumns();
        this.setGoods();
        this.readCurrentCriteriaFromStore();
    }

    ngOnDestroy():void {
        this.done.next(true);
        this.done.complete();
    }

    // Initialize criteria with latest value from store
    readCurrentCriteriaFromStore() {
        this.store.pipe(
            select(goodSelectors.selectCriteria),
            first()
        ).subscribe((criteria:SearchCriteria) => {
            // TODO read matrix parameters from url if none
            if (criteria) {
                // Initialize view with current filters - This will happen when coming from another view
                this.criteria.merge(criteria);
                console.log('Search criteria updated with current value in store');
            } else {
                // Trigger effect and API query - This will happen on page load
                this.storeFilters(this.criteria);
            }
        });
    }

    listenToErrors() {
        this.store.pipe(
            select(goodSelectors.selectError),
            filter((err:BaHttpErrorResponse) => err != null && !err.processed),
            takeUntil(this.done)
        ).subscribe(
            (err:BaHttpErrorResponse) => {
                this.snackbar.showError('Server is temporarily unavailable');
            }
        );
    }

    listenToSearchEvents() {
        const onKeywordsChange = fromEvent(this.searchInput.nativeElement, 'input', {passive:true});
        const onKeywordsClear = fromEvent(this.searchInput.nativeElement, 'blur', {passive:true});

        const onMinQualityChange = this.minQualitySlider.change.asObservable().pipe(
            tap(event => {
                const minQuality = event.value || 0;
                console.log('minQuality:', minQuality);
                this.criteria.minQuality = minQuality;
            })
        );

        merge(onKeywordsChange, onKeywordsClear, onMinQualityChange).pipe(
            debounceTime(500),
            map(() => this.criteria.updateHash().clone()),
            distinctUntilKeyChanged('hash'),
            tap((criteria:SearchCriteria) => {
                console.log('Criteria hash has changed');
            }),
            takeUntil(this.done)
        ).subscribe(
            (criteria:SearchCriteria) => this.storeFilters(criteria)
        );
    }

    setGoods() {
        this.goods$ = this.store.pipe(
            select(goodSelectors.selectFilteredGoods),
            // startWith([]),
            tap(goods => (this.noResult = !goods || !goods.length))
        );
    }

    setColumns() {
        if (!this.columns) {
            this.columns = [
                {id:'name', name:'Name', minWidth:500, prop:'name'},
                {id:'quality', name:'Quality', minWidth:150, prop:'quality'},
                {id:'sellIn', name:'Time left (days)', minWidth:200, prop:'sellIn'},
                {id:'type', name:'Type', minWidth:300, prop:'type'},
            ];
        }
    }

    storeFilters(criteria:SearchCriteria) {
        this.store.dispatch(new GSV_SetSearchFilters({criteria:criteria.clone()}));
        console.log('Search criteria updated in store');
    }

    clearSearchInput() {
        this.criteria.keywords = '';
        this.searchInput.nativeElement.focus();
    }

}
