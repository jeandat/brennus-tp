export enum GoodType {
    LEGENDARY      = 'legendary',
    BACKSTAGE_PASS = 'backstage pass',
    CONJURED       = 'conjured',
    STANDARD       = 'standard'
}

export interface Good {
    id:string;
    name:string;
    quality:number;
    sellIn:number;
    type:GoodType;
}
