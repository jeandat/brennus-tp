import { GoodService } from '../app/good/good-service/good.service';
import SpyObj = jasmine.SpyObj;

export const goodServiceStub:SpyObj<GoodService> = jasmine.createSpyObj('goodServiceStub', ['getList', 'filter']);
