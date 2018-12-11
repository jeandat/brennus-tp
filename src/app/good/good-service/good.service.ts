import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Good } from '../../core/model/good.model';
import { SearchCriteria } from '../model/search-criteria.model';
import { delay, map, tap } from 'rxjs/operators';


@Injectable({
    providedIn:'root'
})
export class GoodService {

    constructor(private http:HttpClient) {}

    getList():Observable<Good[]> {
        return this.http.get<Good[]>(`${environment.apiUrl}/items/`).pipe(
            delay(3000)
        );
    }

    filter(goods:Good[], criteria:SearchCriteria):Good[] {
        console.log('criteria:', criteria);
        console.log('goods:', goods);
        return goods.filter(good => {
            // TODO replace this naive implementation with true fuzzy search
            if (criteria.keywords && good.name.toLowerCase().indexOf(criteria.keywords.toLowerCase()) < 0) return false;
            return good.quality >= criteria.minQuality;
        });
    }
}
