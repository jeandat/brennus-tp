import { ParamMap, Params } from '@angular/router';
import { hash } from '../../core/util';


export class SearchCriteria {

    minQuality = 0;
    keywords = '';
    hash?:number;

    private properties = ['minQuality', 'keywords'];

    constructor(criteria?:any) {
        if (criteria) {
            Object.assign(this, criteria);
        }
    }

    merge(criteria:SearchCriteria) {
        criteria && Object.assign(this, criteria.clone());
    }

    reset() {
        this.properties.forEach(key => {
            this.hash = 0;
            this.keywords = '';
            this.minQuality = 0;
        });
    }

    updateHash() {
        let valueToHash = '';
        for (const prop of this.properties) {
            if (!this[prop]) continue;
            valueToHash += this[prop];
        }
        this.hash = !valueToHash ? 0 : hash(valueToHash);
        return this;
    }

    toUrlSearchParams():URLSearchParams {
        const params:URLSearchParams = new URLSearchParams();
        for (const prop of this.properties) {
            // @ts-ignore
            params.set(prop, this[prop]);
        }
        return params;
    }

    toParams():Params {
        const params:Params = {};
        for (const prop of this.properties) {
            params[prop] = this[prop];
        }
        return params;
    }

    fromParamMap(params:ParamMap) {
        this.reset();
        params.keys.forEach(key => {
            if (!this.properties.includes(key)) return;
            const value = params.get(key);
            if (!value) return;
            this[key] = value;
        });
    }

    clone():SearchCriteria {
        return new SearchCriteria(JSON.parse(JSON.stringify(this)));
    }
}
