import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignInComponent } from './sign-in/sign-in.component';


const components = [
    SignInComponent
];

@NgModule({
    declarations:[ ...components ],
    imports:[
        CommonModule
    ],
    exports:[ ...components ]
})
export class AuthModule {}
