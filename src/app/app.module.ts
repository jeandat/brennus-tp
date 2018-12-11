import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    declarations:[
        AppComponent,
    ],
    imports:[
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        NoopAnimationsModule
        // BrowserAnimationsModule
    ],
    providers:[],
    bootstrap:[ AppComponent ]
})
export class AppModule {}
