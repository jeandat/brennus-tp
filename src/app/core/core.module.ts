import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
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
        RouterModule
        AuthModule,
    ],
    declarations:[
        ...components
    ],
    exports:[
        ...components,
        HttpClientModule
    providers:[
        { provide:HTTP_INTERCEPTORS, useClass:CommonErrorsFilter, multi:true },
    ]
})
export class CoreModule {

    // Security to enforce developpers to import the core module once from the AppModule only.
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it once only');
        }
    }
}
