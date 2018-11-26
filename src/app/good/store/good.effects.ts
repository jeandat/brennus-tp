import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { ActionWithPayload, AppState } from '../../core/store/core.reducer';
import {
    GAPI_GetGoodListFailure,
    GAPI_GetGoodListSuccess,
    GoodActions,
    GoodActionTypes,
    GSV_GetGoodList,
    GSV_SetSearchFilters, GSVC_SetSearchResults
} from './good.actions';
import { Good } from '../../core/model/good.model';
import { GoodService } from '../good-service/good.service';
import { goodSelectors } from './good.selectors';
import { SearchCriteria } from '../model/search-criteria.model';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class GoodEffects {

    // TODO update matrix parameters once done
    @Effect()
    filterGoodList$:Observable<ActionWithPayload> = this.actions$.pipe(
        ofType(GoodActionTypes.GSV_SetSearchFilters),
        map((action:GSV_SetSearchFilters) => {
            console.log(`Intercepted action of type '${action.type}' with payload:`, action.payload);
            return action.payload.criteria;
        }),
        switchMap((criteria:SearchCriteria) => {
            this.ais.on('filterGoodList$');
            return this.store.select(goodSelectors.selectAll).pipe(
                first(),
                switchMap((goods:Good[]) => {
                    if (!goods || !goods.length) {
                        return this.goodService.getList().pipe(
                            map((fetchedGoods:Good[]) => {
                                console.log('HTTP Get Good List Success:', fetchedGoods);
                                this.store.dispatch(new GAPI_GetGoodListSuccess({ goods:fetchedGoods }));
                                return fetchedGoods;
                            })
                        );
                    }
                    return of(goods);
                }),
                map((goods:Good[]) => this.goodService.filter(goods, criteria)),
                map((goods:Good[]) => {
                    console.log(`After filtering, there is ${goods.length} goods:`, goods);
                    return new GSVC_SetSearchResults({ goods });
                }),
                catchError((error:HttpErrorResponse) => {
                    console.error('HTTP Get Good List Failure:', error);
                    return of(new GAPI_GetGoodListFailure({ error }));
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
        private ais:ActivityIndicatorService) {}

}
