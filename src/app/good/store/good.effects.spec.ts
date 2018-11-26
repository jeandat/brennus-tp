import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { of, ReplaySubject, throwError } from 'rxjs';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { ActionWithPayload, AppState } from '../../core/store/core.reducer';
import { Good } from '../../core/model/good.model';
import { GoodEffects } from './good.effects';
import { GoodService } from '../good-service/good.service';
import {
    GAPI_GetGoodListFailure,
    GAPI_GetGoodListSuccess,
    GSV_SetSearchFilters,
    GSVC_SetSearchResults,
    SLV_GetGoodList
} from './good.actions';
import { SearchCriteria } from '../model/search-criteria.model';
import Spy = jasmine.Spy;


const mocks = [ { id:'1', name:'foo' }, { id:'2', name:'bar' }, { id:'3', name:'baz' } ] as Good[];

describe('Good Effects', () => {

    let effects:GoodEffects;
    let actions:ReplaySubject<ActionWithPayload>;

    const gsMock = jasmine.createSpyObj('GoodService', [ 'filter', 'getList' ]) as GoodService;
    const aisMock = jasmine.createSpyObj('ActivityIndicatorService', [ 'on', 'off' ]) as ActivityIndicatorService;
    const storeMock = jasmine.createSpyObj('Store', [ 'select', 'dispatch' ]) as Store<AppState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:[],
            providers:[
                GoodEffects,
                provideMockActions(() => actions),
                { provide:GoodService, useValue:gsMock },
                { provide:ActivityIndicatorService, useValue:aisMock },
                { provide:Store, useValue:storeMock }
            ]
        });

        effects = TestBed.get(GoodEffects);
    });

    it('should filter goods with goods from store', (done) => {
        const criteria = new SearchCriteria();
        criteria.keywords = 'foo';
        const inputAction = new GSV_SetSearchFilters({ criteria });

        const filteredGoods = mocks.filter(mock => mock.name === criteria.keywords);
        const outputAction = new GSVC_SetSearchResults({ goods:filteredGoods });

        (storeMock.select as Spy).and.returnValue(of(mocks));
        // (gsMock.getList as Spy).and.returnValue(of(mocks));
        (gsMock.filter as Spy).and.returnValue(filteredGoods);

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.filterGoodList$.subscribe((result:GSVC_SetSearchResults) => {
            expect(result instanceof GSVC_SetSearchResults).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });
    });

    it('should filter goods with goods from API', (done) => {
        const criteria = new SearchCriteria();
        criteria.keywords = 'foo';
        const inputAction = new GSV_SetSearchFilters({ criteria });

        const filteredGoods = mocks.filter(mock => mock.name === criteria.keywords);
        const outputAction = new GSVC_SetSearchResults({ goods:filteredGoods });

        (storeMock.select as Spy).and.returnValue(of(null));
        (gsMock.getList as Spy).and.returnValue(of(mocks));
        (gsMock.filter as Spy).and.returnValue(filteredGoods);

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.filterGoodList$.subscribe((result:GSVC_SetSearchResults) => {
            expect(result instanceof GSVC_SetSearchResults).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });
    });

    it('should update state with HTTP error when setting search filters', (done) => {
        const criteria = new SearchCriteria();
        criteria.keywords = 'foo';
        const inputAction = new GSV_SetSearchFilters({ criteria });

        const error = new HttpErrorResponse({ status:404 });
        const outputAction = new GAPI_GetGoodListFailure({ error });

        (storeMock.select as Spy).and.returnValue(of(null));
        (gsMock.getList as Spy).and.returnValue(throwError(error));

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.filterGoodList$.subscribe((result:GAPI_GetGoodListFailure) => {
            expect(result instanceof GAPI_GetGoodListFailure).toBe(true);
            expect(result.payload.error).toBe(outputAction.payload.error);
            done();
        });
    });

    it('should load goods from api', (done) => {
        const inputAction = new SLV_GetGoodList();

        const outputAction = new GAPI_GetGoodListSuccess({ goods:mocks });

        (storeMock.select as Spy).and.returnValue(of([]));
        (gsMock.getList as Spy).and.returnValue(of(mocks));

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.getGoodList$.subscribe((result:GAPI_GetGoodListSuccess) => {
            expect(result instanceof GAPI_GetGoodListSuccess).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });

    });

    it('should load goods from store', (done) => {
        const inputAction = new SLV_GetGoodList();

        const outputAction = { type:'noop' };

        (storeMock.select as Spy).and.returnValue(of(mocks));
        (gsMock.getList as Spy).and.returnValue(of(mocks));

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.getGoodList$.subscribe((result:Action) => {
            expect(result).toEqual(outputAction);
            done();
        });
    });

    it('should update state with HTTP error when fetching goods', (done) => {
        const inputAction = new SLV_GetGoodList();

        const error = new HttpErrorResponse({ status:404 });
        const outputAction = new GAPI_GetGoodListFailure({ error });

        (storeMock.select as Spy).and.returnValue(of([]));
        (gsMock.getList as Spy).and.returnValue(throwError(error));

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.getGoodList$.subscribe((result:GAPI_GetGoodListFailure) => {
            expect(result instanceof GAPI_GetGoodListFailure).toBe(true);
            expect(result.payload.error).toBe(outputAction.payload.error);
            done();
        });
    });


});
