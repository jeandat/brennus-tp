import SpyObj = jasmine.SpyObj;
import { SnackBarService } from '../app/core/snackbar/snackbar.service';

export const snackBarServiceStub:SpyObj<SnackBarService> = jasmine.createSpyObj('snackBarServiceStub', [
    'mergeConf',
    'open',
    'showError',
    'showWarning',
    'showInfo',
    'showSuccess',
    'openFromComponent',
    'openFromTemplate',
]);
