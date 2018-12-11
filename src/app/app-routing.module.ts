import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { AdminGuard } from './core/guard/admin.guard';
import { SignInComponent } from './auth/sign-in/sign-in.component';


const routes:Routes = [
    { path:'', component:HomeComponent },
    { path:'admin', loadChildren:'./admin/admin.module#AdminModule', canLoad:[ AdminGuard ] },
    { path:'signin', component:SignInComponent },
    { path:'not-found', component:NotFoundComponent },
    { path:'**', component:NotFoundComponent }
];


@NgModule({
    imports:[ RouterModule.forRoot(routes, {
        preloadingStrategy:PreloadAllModules,
        scrollPositionRestoration:'enabled',
        anchorScrolling:'enabled',
    }) ],
    exports:[ RouterModule ]
})
export class AppRoutingModule {}
