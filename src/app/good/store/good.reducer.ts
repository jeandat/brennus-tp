import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Good } from '../../core/model/good.model';
import { SearchCriteria } from '../model/search-criteria.model';
import { GoodActions, GoodActionTypes } from './good.actions';


export interface GoodState extends EntityState<Good> {
    // additional entities state properties
    error?:any;
    criteria?:SearchCriteria;
    filteredGoods?:Good[];
}


export const goodAdapter:EntityAdapter<Good> = createEntityAdapter<Good>();

export const goodInitialState:GoodState = goodAdapter.getInitialState({
    // additional entity state properties
    error:undefined,
    criteria:undefined,
    filteredGoods:undefined
});

export function goodReducer(state = goodInitialState, action:GoodActions):GoodState {

    switch (action.type) {

        case GoodActionTypes.ResetGoodList: {
            const newState = goodAdapter.removeAll(state);
            return Object.assign(newState, {error:undefined});
        }

        case GoodActionTypes.GAPI_GetGoodListSuccess: {
            const newState = goodAdapter.addAll(action.payload.goods, state);
            return Object.assign(newState, {error:undefined});
        }

        case GoodActionTypes.GAPI_GetGoodListFailure: {
            const diff = {error:action.payload.error};
            return {...state, ...diff} as GoodState;
        }

        case GoodActionTypes.GSV_SetSearchFilters: {
            const criteria = action.payload.criteria;
            const diff = {criteria};
            return {...state, ...diff} as GoodState;
        }

        case GoodActionTypes.GSVC_SetSearchResults: {
            const goods = action.payload.goods;
            const diff = {filteredGoods:goods};
            return {...state, ...diff} as GoodState;
        }

        default: {
            return state;
        }
    }
}
