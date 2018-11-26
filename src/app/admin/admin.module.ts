import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticListComponent } from './statistic-list/statistic-list.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ChartsModule } from 'ng2-charts';


const components = [
    StatisticListComponent
];


@NgModule({
    declarations:[ ...components ],
    imports:[
        CommonModule,
        AdminRoutingModule,
        ChartsModule
    ],
    exports:[ ...components ]
})
export class AdminModule {}
