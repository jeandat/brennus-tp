import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { Good } from '../../core/model/good.model';
import { ActionWithPayload, AppState } from '../../core/store/core.reducer';
import { NO_ACTION } from '../../core/store/no-action';
import { GoodService } from '../good-service/good.service';
import { SearchCriteria } from '../model/search-criteria.model';
import {
    GAPI_GetGoodListFailure,
    GAPI_GetGoodListSuccess,
    GoodActionTypes,
    GSV_SetSearchFilters,
    GSVC_SetSearchResults
} from './good.actions';
import { goodSelectors } from './good.selectors';


@Injectable()
export class GoodEffects {

    @Effect()
    getGoodList$:Observable<ActionWithPayload> = this.actions$.pipe(
        ofType(
            GoodActionTypes.GSV_GetGoodList,
            GoodActionTypes.SLV_GetGoodList
        ),
        withLatestFrom(this.store.pipe(select(goodSelectors.selectAll))),
        exhaustMap(([action, goods]:[ActionWithPayload, Good[]]) => {
            console.log(`Intercepted action of type '${action.type}' with payload:`, action.payload);
            if (goods && goods.length) {
                console.log(`Goods found in store`);
                // Noop.
                return of(NO_ACTION);
            }
            console.log('Goods not found in store => downloading…');
            this.ais.on();
            return this.goodService.getList().pipe(
                map((fetchedGoods:Good[]) => {
                    console.log('HTTP Get Good List Success:', fetchedGoods);
                    return new GAPI_GetGoodListSuccess({goods:fetchedGoods});
                }),
                catchError((error:HttpErrorResponse) => {
                        console.error('HTTP Get Good List Failure:', error);
                        return of(new GAPI_GetGoodListFailure({error}));
                    }
                ),
                tap(() => this.ais.off())
            );
        }),
        tap(result => console.log('Action returned by effect:', result))
    );

    // TODO update matrix parameters once done
    @Effect()
    filterGoodList$:Observable<ActionWithPayload> = this.actions$.pipe(
        ofType(
            GoodActionTypes.GSV_SetSearchFilters
        ),
        map((action:GSV_SetSearchFilters) => {
            console.log(`Intercepted action of type '${action.type}' with payload:`, action.payload);
            return action.payload.criteria;
        }),
        // False positive
        // tslint:disable rxjs-no-unsafe-switchmap
        switchMap((criteria:SearchCriteria) => {
            this.ais.on('filterGoodList$');
            return this.store.pipe(
                select(goodSelectors.selectAll),
                first(),
                exhaustMap((goods:Good[]) => {
                    if (!goods || !goods.length) {
                        return this.goodService.getList().pipe(
                            map((fetchedGoods:Good[]) => {
                                console.log('HTTP Get Good List Success:', fetchedGoods);
                                this.store.dispatch(new GAPI_GetGoodListSuccess({goods:fetchedGoods}));
                                return fetchedGoods;
                            })
                        );
                    }
                    return of(goods);
                }),
                map((goods:Good[]) => this.goodService.filter(goods, criteria)),
                map((goods:Good[]) => {
                    console.log(`After filtering, there is ${goods.length} goods:`, goods);
                    return new GSVC_SetSearchResults({goods});
                }),
                catchError((error:HttpErrorResponse) => {
                    console.error('HTTP Get Good List Failure:', error);
                    return of(new GAPI_GetGoodListFailure({error}));
                })
            );
        }),
        tap(result => {
            this.ais.off('filterGoodList$');
            console.log('Action returned by effect:', result);
        })
    );

    constructor(
        private actions$:Actions,
        private goodService:GoodService,
        private store:Store<AppState>,
        private ais:ActivityIndicatorService) {
    }

}
