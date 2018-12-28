import { ActivityIndicatorService } from '../app/core/activity-indicator/activity-indicator.service';
import SpyObj = jasmine.SpyObj;

export const activityIndicatorServiceStub:SpyObj<ActivityIndicatorService> = jasmine.createSpyObj('activityIndicatorServiceStub', ['on', 'off']);
