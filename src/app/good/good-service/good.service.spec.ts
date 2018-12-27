import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { failure } from '../../../testing/helpers';
import { Good } from '../../core/model/good.model';

import { GoodService } from './good.service';


describe('GoodService', () => {

    let service:GoodService;

    const mocks = [{id:'1'}, {id:'2'}, {id:'3'}] as Good[];

    let httpClient:HttpClient;
    let httpTestingController:HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(GoodService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('can get goods', async(() => {
        service.getList().subscribe(
            (goods:Good[]) => {
                expect(goods).toBeNonEmptyArray();
                expect(goods.length).toBe(mocks.length);
                expect(goods[0].id).toBe(mocks[0].id);
            },
            failure
        );
        const req = httpTestingController.expectOne((httpRequest:HttpRequest<Good>) => httpRequest.url.match(/\/items\//) != null);
        expect(req.request.method).toEqual('GET');
        req.flush(mocks);
    }));

});
