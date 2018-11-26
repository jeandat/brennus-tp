import { Params, RouterStateSnapshot } from '@angular/router';
import { routerReducer, RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { Action, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';


// tslint:disable no-empty-interface
export interface AppState {
    router:RouterReducerState<RouterStateUrl>;
}

export interface RouterStateUrl {
    url:string;
    params:Params;
    queryParams:Params;
}

export const reducers:ActionReducerMap<AppState> = {
    router:routerReducer
};

export const metaReducers:MetaReducer<AppState>[] = !environment.production ? [ storeFreeze ] : [];

// This is a custom serializer used by @ngrx/router-store that is performant and functional.
// @see https://github.com/ngrx/platform/blob/master/docs/router-store/api.md#custom-router-state-serializer
// @issue https://github.com/ngrx/platform/issues/97
export class LightRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState:RouterStateSnapshot):RouterStateUrl {
        let route = routerState.root;
        while (route.firstChild) {
            route = route.firstChild;
        }
        const {
            url,
            root:{ queryParams }
        } = routerState;
        const { params } = route;
        // Only return an object including the URL, params and query params
        // instead of the entire snapshot
        return { url, params, queryParams };
    }
}

export interface ActionWithPayload extends Action {
    payload?:object;
}
