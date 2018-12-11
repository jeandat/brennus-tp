import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';


@NgModule({
    declarations:[
        AppComponent,
    ],
    imports:[
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        NoopAnimationsModule
    ],
    providers:[],
    bootstrap:[AppComponent]
})
export class AppModule {
}
