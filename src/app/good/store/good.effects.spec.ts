import { HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { EMPTY, of, ReplaySubject, throwError } from 'rxjs';
import { activityIndicatorServiceStub } from '../../../testing/activity-indicator-service.stub';
import { goodServiceStub } from '../../../testing/good-service.stub';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { Good } from '../../core/model/good.model';
import { ActionWithPayload } from '../../core/store/core.reducer';
import { NO_ACTION } from '../../core/store/no-action';
import { GoodService } from '../good-service/good.service';
import { SearchCriteria } from '../model/search-criteria.model';
import {
    GAPI_GetGoodListFailure,
    GAPI_GetGoodListSuccess,
    GSV_SetSearchFilters,
    GSVC_SetSearchResults,
    SLV_GetGoodList
} from './good.actions';
import { GoodEffects } from './good.effects';
import { goodReducer, GoodState } from './good.reducer';
import SpyObj = jasmine.SpyObj;


const mocks = [{id:'1', name:'foo'}, {id:'2', name:'bar'}, {id:'3', name:'baz'}] as Good[];

describe('Good Effects', () => {

    let store:Store<GoodState>;
    let effects:GoodEffects;
    let goodService:SpyObj<GoodService>;
    let actions:ReplaySubject<ActionWithPayload>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:[
                StoreModule.forRoot({goods:goodReducer}),
            ],
            providers:[
                GoodEffects,
                provideMockActions(() => actions),
                {provide:GoodService, useValue:goodServiceStub},
                {provide:ActivityIndicatorService, useValue:activityIndicatorServiceStub}
            ]
        });

        effects = TestBed.get(GoodEffects);
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
        goodService = TestBed.get(GoodService);
        actions = new ReplaySubject<ActionWithPayload>(1);
    });

    it('should filter goods with goods from store', (done) => {

        // Input
        const criteria = new SearchCriteria();
        criteria.keywords = 'foo';
        const inputAction = new GSV_SetSearchFilters({criteria});

        // Output
        const filteredGoods = mocks.filter(mock => mock.name === criteria.keywords);
        const outputAction = new GSVC_SetSearchResults({goods:filteredGoods});

        // Set context
        store.dispatch(new GAPI_GetGoodListSuccess({goods:mocks}));
        goodService.filter.and.returnValue(filteredGoods);

        // Trigger effect
        actions.next(inputAction);

        effects.filterGoodList$.subscribe((result:GSVC_SetSearchResults) => {
            expect(result instanceof GSVC_SetSearchResults).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });
    });

    it('should filter goods with goods from API', (done) => {

        // Input
        const criteria = new SearchCriteria();
        criteria.keywords = 'foo';
        const inputAction = new GSV_SetSearchFilters({criteria});

        // Output
        const filteredGoods = mocks.filter(mock => mock.name === criteria.keywords);
        const outputAction = new GSVC_SetSearchResults({goods:filteredGoods});

        // Context
        goodService.getList.and.returnValue(of(mocks));
        goodService.filter.and.returnValue(filteredGoods);

        // Trigger effect
        actions.next(inputAction);

        effects.filterGoodList$.subscribe((result:GSVC_SetSearchResults) => {
            expect(result instanceof GSVC_SetSearchResults).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });
    });

    it('should update state with HTTP error when setting search filters', (done) => {

        // Input
        const criteria = new SearchCriteria();
        criteria.keywords = 'foo';
        const inputAction = new GSV_SetSearchFilters({criteria});

        // Output
        const error = new HttpErrorResponse({status:404});
        const outputAction = new GAPI_GetGoodListFailure({error});

        // Context
        goodService.getList.and.returnValue(throwError(error));

        // Trigger effect
        actions.next(inputAction);

        effects.filterGoodList$.subscribe((result:GAPI_GetGoodListFailure) => {
            expect(result instanceof GAPI_GetGoodListFailure).toBe(true);
            expect(result.payload.error).toBe(outputAction.payload.error);
            done();
        });
    });

    it('should load goods from api', (done) => {

        // Input
        const inputAction = new SLV_GetGoodList();

        // Output
        const outputAction = new GAPI_GetGoodListSuccess({goods:mocks});

        // Context
        store.dispatch(new GAPI_GetGoodListSuccess({goods:[]}));
        goodService.getList.and.returnValue(of(mocks));

        // Trigger effect
        actions.next(inputAction);

        effects.getGoodList$.subscribe((result:GAPI_GetGoodListSuccess) => {
            expect(result instanceof GAPI_GetGoodListSuccess).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });

    });

    it('should load goods from store', (done) => {

        // Input
        const inputAction = new SLV_GetGoodList();

        // Output
        const outputAction = NO_ACTION;

        // Context
        store.dispatch(new GAPI_GetGoodListSuccess({goods:mocks}));
        goodService.getList.and.returnValue(of(mocks));

        // Trigger effect
        actions.next(inputAction);

        effects.getGoodList$.subscribe(
            (result:Action) => {
                expect(result).toEqual(outputAction);
                done();
            }
        );
    });

    it('should update state with HTTP error when fetching goods', (done) => {

        // Input
        const inputAction = new SLV_GetGoodList();

        // Output
        const error = new HttpErrorResponse({status:404});
        const outputAction = new GAPI_GetGoodListFailure({error});

        // Context
        store.dispatch(new GAPI_GetGoodListSuccess({goods:[]}));
        goodService.getList.and.returnValue(throwError(error));

        // Trigger effect
        actions.next(inputAction);

        effects.getGoodList$.subscribe((result:GAPI_GetGoodListFailure) => {
            expect(result instanceof GAPI_GetGoodListFailure).toBe(true);
            expect(result.payload.error).toBe(outputAction.payload.error);
            done();
        });
    });


});
