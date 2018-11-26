import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { goodReducer } from './store/good.reducer';
import { GoodEffects } from './store/good.effects';
import { GoodSearchComponent } from './good-search/good-search.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const components = [
    GoodSearchComponent
];

@NgModule({
    declarations:[...components],
    imports:[
        CommonModule,
        FormsModule,
        StoreModule.forFeature('goods', goodReducer),
        EffectsModule.forFeature([ GoodEffects ]),
        NgxDatatableModule
    ],
    exports:[...components]
})
export class GoodModule {}
