import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';


const components = [
    HomeComponent,
    NotFoundComponent
];


@NgModule({
    imports:[
        CommonModule,
        HttpClientModule
    ],
    declarations:[
        ...components
    ],
    exports:[
        ...components
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
