import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
    providedIn:'root'
})
export class AdminGuard implements CanActivate, CanLoad {


    canLoad(route:Route, segments:UrlSegment[]):Observable<boolean> | Promise<boolean> | boolean {
        // In true life, we would check user permissions here
        // There is little interest to simulate that for the purpose of this project
        return true;
    }

    canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean {
        // In true life, we would check user permissions here
        // There is little interest to simulate that for the purpose of this project
        return true;
    }


}
