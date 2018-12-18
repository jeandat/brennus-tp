import { createFeatureSelector, createSelector } from '@ngrx/store';
import { goodAdapter, GoodState } from './good.reducer';


export const selectGoods = createFeatureSelector<GoodState>('goods');

const {
          selectIds,
          selectEntities,
          selectAll,
          selectTotal
      } = goodAdapter.getSelectors(selectGoods);

export const goodSelectors = {

    // Main selectors generated by the adapter
    selectIds, selectEntities, selectAll, selectTotal,

    selectError:createSelector(
        selectGoods,
        (state:GoodState) => state.error
    ),

    selectCriteria:createSelector(
        selectGoods,
        (state:GoodState) => state.criteria
    ),

    selectFilteredGoods:createSelector(
        selectGoods,
        (state:GoodState) => state.filteredGoods
    ),

};