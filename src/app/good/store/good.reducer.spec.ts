import { HttpErrorResponse } from '@angular/common/http';
import { goodInitialState, goodReducer } from './good.reducer';
import { Good } from '../../core/model/good.model';
import { GAPI_GetGoodListFailure, GAPI_GetGoodListSuccess, GSV_SetSearchFilters, ResetGoodList } from './good.actions';
import { SearchCriteria } from '../model/search-criteria.model';


const mocks = [ { id:'1' }, { id:'2' }, { id:'3' } ] as Good[];

describe('Good Reducer', () => {

    it('should return the initial state', () => {
        const action = {} as any;
        const result = goodReducer(goodInitialState, action);
        expect(result).toBe(goodInitialState);
    });

    it('should set goods from API', () => {
        const action = new GAPI_GetGoodListSuccess({ goods:mocks });
        const newState = goodReducer(goodInitialState, action);
        expect(newState.ids.length).toBe(mocks.length);
        expect(Object.keys(newState.entities).length).toBe(mocks.length);
        expect(newState.error).toBeFalsy();
    });

    it('should reset state', () => {
        const action = new GAPI_GetGoodListSuccess({ goods:mocks });
        let newState = goodReducer(goodInitialState, action);
        expect(Object.keys(newState.entities).length).toBe(mocks.length);
        newState = goodReducer(goodInitialState, new ResetGoodList());
        expect(Object.keys(newState.entities).length).toBe(0);
        expect(newState.ids.length).toBe(0);
        expect(newState).toEqual(goodInitialState);
    });

    it('should set error from API', () => {
        const error = new HttpErrorResponse({ status:404 });
        const action = new GAPI_GetGoodListFailure({ error });
        const newState = goodReducer(goodInitialState, action);
        expect(newState.error).toBe(error);
    });

    it('should set good filters', () => {
        const criteria = new SearchCriteria();
        criteria.keywords = 'elixir';
        const action = new GSV_SetSearchFilters({ criteria});
        const newState = goodReducer(goodInitialState, action);
        expect(newState.ids.length).toBe(0);
        expect(Object.keys(newState.entities).length).toBe(0);
        expect(newState.criteria.keywords).toBe(criteria.keywords);
    });

});
