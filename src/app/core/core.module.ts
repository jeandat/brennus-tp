import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ActivityIndicatorComponent } from './activity-indicator/activity-indicator.component';
import { CommonErrorsFilter } from './network/common-errors-filter.service';
import { StoreModule } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { LightRouterStateSerializer, metaReducers, reducers } from './store/core.reducer';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { AuthModule } from '../auth/auth.module';


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
        StoreModule.forRoot(reducers, { metaReducers }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreRouterConnectingModule.forRoot({ stateKey:'router' }),
        EffectsModule.forRoot([])
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
        { provide:HTTP_INTERCEPTORS, useClass:CommonErrorsFilter, multi:true },
        { provide:RouterStateSerializer, useClass:LightRouterStateSerializer }
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
