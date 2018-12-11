import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { AuthModule } from '../auth/auth.module';
import { GoodModule } from '../good/good.module';
import { ActivityIndicatorComponent } from './activity-indicator/activity-indicator.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonErrorsFilter } from './network/common-errors-filter.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { LightRouterStateSerializer, metaReducers, reducers } from './store/core.reducer';


const components = [
    NavbarComponent,
    NotFoundComponent,
    HomeComponent,
    ActivityIndicatorComponent
];


@NgModule({
    imports:[
        CommonModule,
        HttpClientModule,
        RouterModule,
        AuthModule,
        GoodModule,
        StoreModule.forRoot(reducers, {metaReducers}),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreRouterConnectingModule.forRoot({stateKey:'router'}),
        EffectsModule.forRoot([]),
        MatToolbarModule
    ],
    declarations:[
        ...components
    ],
    exports:[
        ...components,
        HttpClientModule,
        StoreModule,
        !environment.production ? StoreDevtoolsModule : [],
        StoreRouterConnectingModule,
        EffectsModule
    ],
    providers:[
        {provide:HTTP_INTERCEPTORS, useClass:CommonErrorsFilter, multi:true},
        {provide:RouterStateSerializer, useClass:LightRouterStateSerializer}
    ]
})
export class CoreModule {

    // Security to enforce developpers to import the core module once from the AppModule only.
    constructor(@Optional() @SkipSelf() parentModule:CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it once only');
        }
    }
}
