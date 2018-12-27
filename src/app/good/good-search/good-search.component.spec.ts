import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSliderModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { activityIndicatorServiceStub } from '../../../testing/activity-indicator-service.stub';
import { goodServiceStub } from '../../../testing/good-service.stub';
import { failure } from '../../../testing/helpers';
import { goodsMock } from '../../../testing/mock/goods.mock';
import { snackBarServiceStub } from '../../../testing/snack-bar-service.stub';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { Good } from '../../core/model/good.model';
import { SnackBarService } from '../../core/snackbar/snackbar.service';
import { AppState } from '../../core/store/core.reducer';
import { SharedModule } from '../../shared/shared.module';
import { GoodService } from '../good-service/good.service';
import { GSVC_SetSearchResults } from '../store/good.actions';
import { goodReducer, GoodState } from '../store/good.reducer';
import { GoodSearchComponent } from './good-search.component';


describe('GoodSearchComponent', () => {

    let component:GoodSearchComponent;
    let fixture:ComponentFixture<GoodSearchComponent>;
    let store:Store<GoodState>;

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
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(store).toBeTruthy();
    });

    it('should create ngx-datatable columns', () => {
        expect(component.columns).toBeNonEmptyArray();
        const columns = fixture.debugElement.nativeElement.querySelectorAll('datatable-header-cell');
        expect(columns).toBeDefined();
        expect(columns.length).toBe(component.columns.length);
    });

    // That's the whole point of using a store.
    // The component doesn't know where the goods come from nor wheter they were already in the store or downloaded from a server.
    // => It means the store should be mocked with a list of goods and the effect not even be used.
    it('should render a list of goods', () => {

        let goods:Good[];
        component.goods$.subscribe(
            g => goods = g,
            failure
        );

        expect(component.noResult).toBe(true);
        expect(goods).toBeFalsy();

        store.dispatch(new GSVC_SetSearchResults({goods:goodsMock}));

        expect(component.noResult).toBe(false);
        const tableContainerDe = fixture.debugElement.query(By.css('.goods-table-container'));
        expect(tableContainerDe.classes['no-result']).toBe(true);
        expect(goods).toBeNonEmptyArray();
    });

    it('should read current criteria from store and init view', () => {

    });

    it('should read current criteria from store and trigger first load', () => {

    });

    it('should display error', () => {

    });

    it('should reset keywords and update search results', () => {

    });

    it('should update search results on keywords change', () => {

    });

    it('should update search results on min quality change', () => {

    });
});
