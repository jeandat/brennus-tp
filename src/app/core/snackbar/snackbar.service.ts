import { Injectable } from '@angular/core';
import Toast = M.Toast;
import ToastOptions = M.ToastOptions;

export enum SnackBarType {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error'
}

export enum SnackBarStategy {
    FirstOne = 'firstOne', // Default One
    // LastOne = 'lastOne',
    OneByOne = 'oneByOne',
    AllIn = 'allIn'
}

export interface SnackBarShowOptions {
    // Text or inline HTML inserted in the message zone.
    content:string;
    // If true, replace toast content entirely (no default template). Default: false.
    raw?:boolean;
    // Action button text. Default: ''
    action?:string;
    // Type of message: will impact colors. Default: SnackBarType.Info.
    type?:SnackBarType;
    // Timeout in ms after which the snackbar is hidden. If 0, stay indefinitely until dismissed manually. Default: 4000.
    displayLength?:number;
    // Strategy
    strategy?:SnackBarStategy;
    // Toast instance
    toast?:Toast;
}

export const defaultOptions:SnackBarShowOptions = {
    content:'',
    raw:false,
    type:SnackBarType.Info,
    displayLength:4000,
    strategy:SnackBarStategy.FirstOne,
    toast:undefined
};

@Injectable({
    providedIn:'root'
})
export class SnackBar {

    private stack:SnackBarShowOptions[] = [];

    constructor() { }

    // Show a snackbar which is like Material Design Snackbar component
    // Use the Toast service behind the scene.
    // Only one toast can be displayed at a time.
    // If #show is called several times, calls are stacked by default, i.e. only one toast at at time (team synchronization).
    // You can pass false to the stack parameter to play solo.
    show(options:SnackBarShowOptions):Promise<boolean> {

        options = Object.assign({}, defaultOptions, options);

        let resolved = false;
        return new Promise<boolean>((resolve, reject) => {

            // tslint:disable:prefer-const
            let { content, raw, action, type, displayLength, strategy } = options;

            switch (strategy) {
                // @ts-ignore
                case SnackBarStategy.OneByOne:
                    this.stack.push(options);
                    // The next in line will be invoked once the current one has disappeared.
                    if (this.stack.length > 1) return;
                    break;
                // @ts-ignore
                case SnackBarStategy.FirstOne:
                    if (this.stack.length === 0) this.stack.push(options);
                    else return;
                    break;
                // case SnackBarStategy.LastOne:
                //     const opts = this.stack.pop();
                //     if (opts && opts.toast) opts.toast.dismiss();
                //     this.stack = [ options ];
                //     break;
            }

            // Materialize doesn't permit to keep a snackbar Indefinitely, so I'm simulating this with something very long…
            if (displayLength === 0) {
                displayLength = Number.POSITIVE_INFINITY;
                // Force a close button or it would stay on screen indefinitely.
                if (!action) action = 'DISMISS';
            }

            let html = '', actionTemplate = '', colorClass = `${type}-color`;

            if (raw) {
                html = `${content}`;
            } else {
                if (action) actionTemplate = `<button class="btn-flat toast-action ${colorClass}">${action}</button>`;
                html = `<span>${content}</span>${actionTemplate}`;
            }

            let toast:Toast | any;

            const toastOptions:ToastOptions | any = {
                html,
                classes:`snackbar snackbar--${type}`,
                displayLength
            };

            // This callback is invoked once the toast is dismissed either naturally (timeout) or by clicking the action button.
            toastOptions.completeCallback = () => {
                this.stack.shift();
                resolve(resolved);
                if (this.stack.length) this.show(this.stack[ 0 ]);
            };

            // Add toast to DOM
            toast = M.toast(toastOptions);

            options.toast = toast;

            if (action) {
                // This callback is invoked when clicking the action button
                // It will dismiss the toast
                toast.el.querySelector('.toast-action').addEventListener('click', () => {
                    resolved = true;
                    toast.dismiss();
                }, { passive:true });
            }
        });

    }
}
