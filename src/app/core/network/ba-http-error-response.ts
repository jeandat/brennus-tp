import { HttpErrorResponse } from '@angular/common/http';

export interface BaHttpErrorResponse extends HttpErrorResponse {
    processed?:boolean;
}
