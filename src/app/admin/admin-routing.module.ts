import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StatisticListComponent } from './statistic-list/statistic-list.component';
import { AdminGuard } from '../core/guard/admin.guard';


const routes:Routes = [
    { path:'', component:StatisticListComponent, canActivate:[ AdminGuard ] }
];


@NgModule({
    imports:[ RouterModule.forChild(routes) ],
    exports:[ RouterModule ]
})
export class AdminRoutingModule {}
