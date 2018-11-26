import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoodService } from '../good-service/good.service';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { Good } from '../../core/model/good.model';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../core/store/core.reducer';
import { select, Store } from '@ngrx/store';
import { SnackBar, SnackBarStategy, SnackBarType } from '../../core/snackbar/snackbar.service';
import { goodSelectors } from '../store/good.selectors';
import { debounceTime, distinctUntilKeyChanged, filter, first, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { BaHttpErrorResponse } from '../../core/network/ba-http-error-response';
import { GSV_SetSearchFilters } from '../store/good.actions';
import { SearchCriteria } from '../model/search-criteria.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnDefinition } from './column-definition';


@Component({
    selector:'ba-good-search',
    templateUrl:'./good-search.component.html',
    styleUrls:[ './good-search.component.scss' ]
})
export class GoodSearchComponent implements OnInit, OnDestroy {

    // Search Form
    // -----------

    // DOM references
    @ViewChild('searchInput', { read:ElementRef }) searchInput:ElementRef;
    @ViewChild('minQualitySlider', { read:ElementRef }) minQualitySlider:ElementRef;
    @ViewChild('searchForm', { read:ElementRef }) searchForm:ElementRef;
    // Current selected filters
    criteria = new SearchCriteria();
    goods$:Observable<Good[]>;


    // Data
    // -----
    selectedRows:any[] = [];


    // Datatable
    // ---------
    // Should we use virtual scrolling?
    scrollbarV = true;
    // Table properties
    rowHeight = 50;
    headerHeight = 50;
    footerHeight = 50;
    pageLimit = 50;
    // DOM References
    @ViewChild('goodsTableContainer', { read:ElementRef }) goodsTableContainer:ElementRef;
    @ViewChild('datatable') datatable:DatatableComponent;
    // Columns definition
    columns:ColumnDefinition[];
    // Observable fueled by the slider change events
    private onMinQualityChange = new Subject<number>();


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
        private snackbar:SnackBar) {}

    ngOnInit() {
        this.listenToErrors();
        this.listenToSearchEvents();
        this.setColumns();
        this.setGoods();
        this.initializeSliders();
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
                this.criteria.merge(criteria.clone());
                console.log('Search criteria updated with current value in store');
            }
            this.storeFilters(this.criteria);
        });
    }

    listenToErrors() {
        this.store.pipe(
            select(goodSelectors.selectError),
            filter((err:BaHttpErrorResponse) => err != null && !err.processed),
            takeUntil(this.done)
        ).subscribe(
            (err:BaHttpErrorResponse) => {
                this.snackbar.show({
                    content:'Server is temporarily unavailable',
                    type:SnackBarType.Error,
                    strategy:SnackBarStategy.FirstOne
                });
            }
        );
    }

    listenToSearchEvents() {
        const onFormSubmission = fromEvent(this.searchForm.nativeElement, 'submit', { passive:true }).pipe(
            tap((event:Event) => {
                event.preventDefault();
                console.log('Form submitted');
            })
        );

        merge(onFormSubmission, this.onMinQualityChange).pipe(
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
            startWith([]),
            tap(goods => {
                if (!goods || !goods.length) {
                    this.goodsTableContainer.nativeElement.classList.add('no-results');
                } else {
                    this.goodsTableContainer.nativeElement.classList.remove('no-results');
                }
            })
        );
    }

    setColumns() {
        if (!this.columns) {
            this.columns = [
                { id:'name', name:'Name', minWidth:500, prop:'name' },
                { id:'quality', name:'Quality', minWidth:150, prop:'quality' },
                { id:'sellIn', name:'Time left (days)', minWidth:200, prop:'sellIn' },
                { id:'type', name:'Type', minWidth:300, prop:'type' },
            ];
        }
    }

    storeFilters(criteria:SearchCriteria) {
        this.store.dispatch(new GSV_SetSearchFilters({ criteria:criteria.clone() }));
        console.log('Search criteria updated in store');
    }

    clearSearchInput() {
        this.criteria.keywords = '';
        this.searchInput.nativeElement.focus();
    }

    initializeSliders() {
        setTimeout(() => {
            const slider = noUiSlider.create(this.minQualitySlider.nativeElement, {
                start:[ 0 ],
                connect:true,
                step:1,
                orientation:'horizontal',
                range:{
                    min:0,
                    max:50
                },
                format:wNumb({
                    decimals:0
                })
            });
            this.minQualitySlider.nativeElement.noUiSlider.on('change', ([ minQuality ]) => {
                minQuality = !minQuality ? 0 : parseInt(minQuality, 10);
                this.criteria.minQuality = minQuality;
                this.onMinQualityChange.next(minQuality);
            });
        }, 0);
    }

}
