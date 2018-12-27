import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { AdminRoutingModule } from './admin-routing.module';
import { StatisticListComponent } from './statistic-list/statistic-list.component';


const components = [
    StatisticListComponent
];


@NgModule({
    declarations:[...components],
    imports:[
        CommonModule,
        AdminRoutingModule,
        ChartsModule,
    ],
    exports:[...components]
})
export class AdminModule {
}
