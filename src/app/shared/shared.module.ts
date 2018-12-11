import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from './svg-icon/svg-icon.component';


const components = [ SvgIconComponent ];


@NgModule({
    declarations:[ ...components ],
    imports:[
        CommonModule
    ],
    exports:[ ...components ]
})
export class SharedModule {}
