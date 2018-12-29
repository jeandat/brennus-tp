import { HttpErrorResponse } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSliderModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { min } from 'rxjs/operators';
import { AbstractComponentTester } from '../../../testing/abstract-component-tester';
import { activityIndicatorServiceStub } from '../../../testing/activity-indicator-service.stub';
import { goodServiceStub } from '../../../testing/good-service.stub';
import { failure } from '../../../testing/helpers';
import { goodsMock } from '../../../testing/mock/goods.mock';
import { snackBarServiceStub } from '../../../testing/snack-bar-service.stub';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { Good } from '../../core/model/good.model';
import { AppError } from '../../core/network/app-error';
import { SnackBarService } from '../../core/snackbar/snackbar.service';
import { SharedModule } from '../../shared/shared.module';
import { GoodService } from '../good-service/good.service';
import { SearchCriteria } from '../model/search-criteria.model';
import { GAPI_GetGoodListFailure, GSV_GetFilteredGoods, GSVC_GetFilteredGoodsSuccess } from '../store/good.actions';
import { goodReducer, GoodState } from '../store/good.reducer';
import { GoodSearchComponent } from './good-search.component';
import SpyObj = jasmine.SpyObj;

class ComponentTester extends AbstractComponentTester<GoodSearchComponent> {

    get keywords():string {
        const searchInput = this.fixture.nativeElement.querySelector('#search-input');
        return searchInput.value;
    }

    set keywords(keywords:string) {
        const searchInput = this.fixture.nativeElement.querySelector('#search-input');
        searchInput.value = keywords;
        searchInput.dispatchEvent(new Event('input'));
    }

    get minQuality():number {
        const minQualitySliderDe = this.fixture.debugElement.query(By.css('#min-quality-slider'));
        return minQualitySliderDe.componentInstance.value;
    }

    set minQuality(minQuality:number) {
        const minQualitySliderDe = this.fixture.debugElement.query(By.css('#min-quality-slider'));
        minQualitySliderDe.componentInstance.value = minQuality;
        minQualitySliderDe.componentInstance.change.emit({value:minQuality});
    }

}


describe('GoodSearchComponent', () => {

    let component:GoodSearchComponent;
    let fixture:ComponentFixture<GoodSearchComponent>;
    let store:Store<GoodState>;
    let tester:ComponentTester;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[GoodSearchComponent],
            imports:[
                NoopAnimationsModule,
                RouterTestingModule,
                FormsModule,
                StoreModule.forRoot({goods:goodReducer}),
                NgxDatatableModule,
                MatSliderModule,
                MatFormFieldModule,
                MatInputModule,
                SharedModule
            ],
            providers:[
                {provide:GoodService, useValue:goodServiceStub},
                {provide:SnackBarService, useValue:snackBarServiceStub},
                {provide:ActivityIndicatorService, useValue:activityIndicatorServiceStub}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GoodSearchComponent);
        tester = new ComponentTester(fixture);
        component = fixture.componentInstance;
        spyOn(component, 'storeFilters').and.callThrough();
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(store).toBeTruthy();
    });

    it('should create ngx-datatable columns', () => {
        fixture.detectChanges();
        expect(component.columns).toBeNonEmptyArray();
        const columnsDe = fixture.debugElement.queryAll(By.css('datatable-header-cell'));
        expect(columnsDe.length).toBe(component.columns.length);
    });

    // That's the whole point of using a store.
    // The component doesn't know where the goods come from nor wheter they were already in the store or downloaded from a server.
    // => It means the store should be mocked with a list of goods and the effect not even be used.
    it('should render a list of goods', () => {

        fixture.detectChanges();

        let goods:Good[];
        component.goods$.subscribe(
            g => goods = g,
            failure
        );

        expect(component.noResult).toBe(true);
        expect(goods).toBeFalsy();

        store.dispatch(new GSVC_GetFilteredGoodsSuccess({goods:goodsMock}));

        expect(component.noResult).toBe(false);
        const tableContainerDe = fixture.debugElement.query(By.css('.goods-table-container'));
        expect(tableContainerDe.classes['no-result']).toBe(true);
        expect(goods).toBeNonEmptyArray();
    });

    it('should read current criteria from store and init view', fakeAsync(() => {
        const criteria = new SearchCriteria({minQuality:20, keywords:'rag'});
        store.dispatch(new GSV_GetFilteredGoods({criteria}));

        fixture.detectChanges();

        expect(component.storeFilters).not.toHaveBeenCalled();
        expect(component.criteria.minQuality).toBe(criteria.minQuality);
        expect(component.criteria.keywords).toBe(criteria.keywords);

        flush();

        expect(tester.keywords).toBe(criteria.keywords);
        expect(tester.minQuality).toBe(criteria.minQuality);
    }));

    it('should read current criteria from store and trigger first load', () => {
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalled();
    });

    it('should display error', () => {

        const snackbar:SpyObj<SnackBarService> = TestBed.get(SnackBarService);
        fixture.detectChanges();
        expect(snackbar.showError).not.toHaveBeenCalled();

        const error = new HttpErrorResponse({status:404});
        store.dispatch(new GAPI_GetGoodListFailure({error}));
        expect(snackbar.showError).toHaveBeenCalled();
        snackbar.showError.calls.reset();

        (error as AppError).processed = true;
        store.dispatch(new GAPI_GetGoodListFailure({error}));
        expect(snackbar.showError).not.toHaveBeenCalled();
    });

    it('should reset keywords and update search filters', fakeAsync((done) => {
        const keywords = 'rag';
        component.criteria.keywords = keywords;
        tester.detectAndFlush();

        expect(tester.keywords).toBe(keywords);

        fixture.detectChanges();
        const clearIcon = fixture.nativeElement.querySelector('.clear-icon');
        expect(clearIcon).not.toBeNull();
        clearIcon.click();
        tester.detectAndFlush();

        expect(component.criteria.keywords).toBe('');
        expect(tester.keywords).toBe('');
    }));

    it('should update search filters on keywords change', fakeAsync(() => {
        const keywords = 'rag';
        tester.detectAndFlush();

        tester.keywords = keywords;
        fixture.detectChanges();
        tick(1000);

        expect(component.storeFilters).toHaveBeenCalledWith(component.criteria);
        expect(component.criteria.keywords).toBe(keywords);
    }));

    it('should update search filters on min quality change', fakeAsync(() => {
        const minQuality = 50;
        tester.detectAndFlush();

        tester.minQuality = minQuality;
        tick(1000);

        expect(component.storeFilters).toHaveBeenCalledWith(component.criteria);
        expect(component.criteria.minQuality).toBe(minQuality);
    }));
});
