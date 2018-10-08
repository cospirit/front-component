import { Location } from "vue-router";

export interface Dictionary<T> { [key: string]: T; }

export class Route implements Location {
    public name?: string;
    public params?: Dictionary<string>;

    constructor(name: string, params: Dictionary<string>) {
        this.name = name;
        this.params = params;
    }
}
