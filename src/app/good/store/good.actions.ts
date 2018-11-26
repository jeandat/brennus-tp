// tslint:disable class-name

import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Good } from '../../core/model/good.model';
import { SearchCriteria } from '../model/search-criteria.model';


export enum GoodActionTypes {
    GSV_GetGoodList         = '[Good Search View] Get Good List',
    SLV_GetGoodList         = '[Statistic List View] Get Good List',
    GAPI_GetGoodListSuccess = '[Good API] Get Good List Success',
    GAPI_GetGoodListFailure = '[Good API] Get Good List Failure',
    GSV_SetSearchFilters    = '[Good Search View] Set Search Filters',
    GSVC_SetSearchResults   = '[Good Service] Set Search Results',

    ResetGoodList           = 'Reset Good List'
}


export class GSV_GetGoodList implements Action {
    readonly type = GoodActionTypes.GSV_GetGoodList;

    constructor(public payload = {}) {}
}

export class SLV_GetGoodList implements Action {
    readonly type = GoodActionTypes.SLV_GetGoodList;

    constructor(public payload = {}) {}
}


export class ResetGoodList implements Action {
    readonly type = GoodActionTypes.ResetGoodList;

    constructor(public payload = {}) {}
}


export class GAPI_GetGoodListSuccess implements Action {
    readonly type = GoodActionTypes.GAPI_GetGoodListSuccess;

    constructor(public payload:{ goods:Good[] }) {}
}


export class GAPI_GetGoodListFailure implements Action {
    readonly type = GoodActionTypes.GAPI_GetGoodListFailure;

    constructor(public payload:{ error:HttpErrorResponse }) {}
}


export class GSV_SetSearchFilters implements Action {
    readonly type = GoodActionTypes.GSV_SetSearchFilters;

    constructor(public payload:{ criteria:SearchCriteria }) {}
}


export class GSVC_SetSearchResults implements Action {
    readonly type = GoodActionTypes.GSVC_SetSearchResults;

    constructor(public payload:{ goods:Good[] }) {}
}


export type GoodActions =
    GSV_GetGoodList
    | SLV_GetGoodList
    | ResetGoodList
    | GAPI_GetGoodListSuccess
    | GAPI_GetGoodListFailure
    | GSV_SetSearchFilters
    | GSVC_SetSearchResults;
