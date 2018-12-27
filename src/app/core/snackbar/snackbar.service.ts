import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material';

export enum SnackBarType {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error'
}

export enum SnackBarStategy {
    FirstOne = 'firstOne', // Default One
    AllIn = 'allIn'
}

export interface MatSnackBarConfigExtended extends MatSnackBarConfig {
    // The length of time in milliseconds to wait before automatically dismissing the snack bar.
    duration?:number;
    // Type of message: will impact colors. Default: SnackBarType.Info.
    type?:SnackBarType;
    // Strategy regarding concurrency. What happens if several snackbar are opened while one is already visible?
    strategy?:SnackBarStategy;
}

export const defaultOptions:MatSnackBarConfigExtended = {
    duration:4000,
    type:SnackBarType.Info,
    strategy:SnackBarStategy.FirstOne,
};

@Injectable({
    providedIn:'root'
})
export class SnackBarService {

    private ref:MatSnackBarRef<any>;

    constructor(private snackbar:MatSnackBar) {
    }

    mergeConf(config:MatSnackBarConfigExtended):MatSnackBarConfigExtended {
        const newConfig = Object.assign({}, defaultOptions, config);
        newConfig.panelClass = 'snackbar-' + newConfig.type;
        return newConfig;
    }

    open(message:string, action:string, config:MatSnackBarConfigExtended):MatSnackBarRef<any> {
        config = this.mergeConf(config);
        if (config.strategy === SnackBarStategy.FirstOne && this.ref) return;
        this.ref = this.snackbar.open(message, action, config);
        this.ref.afterDismissed().subscribe(() => this.ref = null);
        return this.ref;
    }

    showError(message:string) {
        return this.open(message, null, {type:SnackBarType.Error});
    }

    showWarning(message:string) {
        return this.open(message, null, {type:SnackBarType.Warning});
    }

    showInfo(message:string) {
        return this.open(message, null, {type:SnackBarType.Info});
    }

    showSuccess(message:string) {
        return this.open(message, null, {type:SnackBarType.Success});
    }

    openFromComponent(component:ComponentType<any>, config:MatSnackBarConfigExtended):MatSnackBarRef<any> {
        config = this.mergeConf(config);
        if (config.strategy === SnackBarStategy.FirstOne && this.ref) return;
        this.ref = this.snackbar.openFromComponent(component, config);
        this.ref.afterDismissed().subscribe(() => this.ref = null);
        return this.ref;
    }

    openFromTemplate(template:TemplateRef<any>, config:MatSnackBarConfigExtended):MatSnackBarRef<any> {
        config = this.mergeConf(config);
        if (config.strategy === SnackBarStategy.FirstOne && this.ref) return;
        this.ref = this.snackbar.openFromTemplate(template, config);
        this.ref.afterDismissed().subscribe(() => this.ref = null);
        return this.ref;
    }
}
